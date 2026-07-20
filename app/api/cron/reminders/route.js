// GET /api/cron/reminders — send 24h + 2h appointment reminders (Task D).
//
// Called on a schedule (Vercel Cron, or any external scheduler that sends the
// bearer secret). For each due booking it emails a reminder via Brevo and flips
// the reminded_24h / reminded_2h flag so it's never sent twice.
//
// Requires (server-only): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// BREVO_API_KEY, CRON_SECRET. Selection logic lives in the SQL function
// public.due_reminders(kind) (SECURITY DEFINER — resolves the customer email).
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, bookingReminderEmail, reviewRequestEmail, billingBlockedEmail } from "@/lib/email";
import { signReviewToken } from "@/lib/reviewToken";

const GRACE_MS = 14 * 24 * 3600 * 1000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function whenText(startsAt) {
  return new Date(startsAt).toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe",
  });
}

async function processKind(supabase, kind) {
  const flag = kind === "2h" ? "reminded_2h" : "reminded_24h";
  const { data: due, error } = await supabase.rpc("due_reminders", { p_kind: kind });
  if (error) return { kind, error: error.message };
  if (!due || !due.length) return { kind, due: 0, sent: 0 };

  const sentIds = [];
  for (const b of due) {
    let delivered = false;
    if (b.email) {
      const { subject, html } = bookingReminderEmail({
        studioName: b.studio_name || "",
        serviceName: b.service_name || "",
        whenText: whenText(b.starts_at),
        kind,
      });
      const mail = await sendBrevoEmail({ to: b.email, subject, html });
      if (!mail.error) delivered = true;
      else console.error(`[cron] ${kind} reminder email failed for ${b.id}:`, mail.error);
    }
    // Reminders are email-only. Flag flips when the email went out.
    if (delivered) sentIds.push(b.id);
  }

  // Flip the flag only for the ones that actually went out, so transient email
  // failures get retried on the next run instead of being silently dropped.
  if (sentIds.length) {
    const { error: upErr } = await supabase.from("bookings").update({ [flag]: true }).in("id", sentIds);
    if (upErr) console.error(`[cron] ${kind} flag update failed:`, upErr.message);
  }
  return { kind, due: due.length, sent: sentIds.length };
}

// Post-visit review requests: email a signed review link, then stamp
// review_requested_at so it goes out only once per booking.
async function processReviewRequests(supabase, origin) {
  const { data: due, error } = await supabase.rpc("due_review_requests");
  if (error) return { kind: "review_request", error: error.message };
  if (!due || !due.length) return { kind: "review_request", due: 0, sent: 0 };

  const sentIds = [];
  for (const b of due) {
    if (!b.email) continue;
    const token = signReviewToken(b.id);
    if (!token) return { kind: "review_request", error: "review_secret_not_configured" };
    const reviewUrl = `${origin}/review/${b.id}?t=${token}`;
    const { subject, html } = reviewRequestEmail({
      studioName: b.studio_name || "",
      serviceName: b.service_name || "",
      reviewUrl,
    });
    const mail = await sendBrevoEmail({ to: b.email, subject, html });
    if (!mail.error) sentIds.push(b.id);
    else console.error(`[cron] review request email failed for ${b.id}:`, mail.error);
  }

  if (sentIds.length) {
    const stamp = new Date().toISOString();
    const { error: upErr } = await supabase.from("bookings").update({ review_requested_at: stamp }).in("id", sentIds);
    if (upErr) console.error("[cron] review_requested_at update failed:", upErr.message);
  }
  return { kind: "review_request", due: due.length, sent: sentIds.length };
}

// Suspend studios whose free/paid period + 14-day grace has lapsed without payment.
async function processBilling(supabase) {
  const { data, error } = await supabase
    .from("studios")
    .select("id, name, owner_email, trial_ends_at, paid_until")
    .eq("billing_blocked", false);
  if (error) return { kind: "billing", error: error.message };
  const now = Date.now();
  const overdue = (data || []).filter((s) => {
    const due = s.paid_until ? new Date(s.paid_until).getTime() : (s.trial_ends_at ? new Date(s.trial_ends_at).getTime() : null);
    return due != null && due + GRACE_MS < now;
  });
  let blocked = 0;
  for (const s of overdue) {
    const { error: upErr } = await supabase.from("studios").update({ billing_blocked: true }).eq("id", s.id);
    if (upErr) { console.error("[cron] billing block failed:", upErr.message); continue; }
    blocked++;
    if (s.owner_email) {
      const { subject, html } = billingBlockedEmail({ studioName: s.name || "" });
      const mail = await sendBrevoEmail({ to: s.owner_email, subject, html });
      if (mail.error) console.error(`[cron] billing email failed for ${s.id}:`, mail.error);
    }
  }
  return { kind: "billing", checked: (data || []).length, blocked };
}

export async function GET(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return NextResponse.json({ error: "cron_secret_not_configured" }, { status: 503 });
  if (!url || !serviceKey) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });

  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set;
  // external schedulers can send the same header (or ?token=).
  const auth = req.headers.get("authorization") || "";
  const token = new URL(req.url).searchParams.get("token");
  if (auth !== `Bearer ${cronSecret}` && token !== cronSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const origin = new URL(req.url).origin;
  const results = [];
  results.push(await processKind(supabase, "24h"));
  results.push(await processKind(supabase, "2h"));
  results.push(await processReviewRequests(supabase, origin));
  results.push(await processBilling(supabase));

  return NextResponse.json({ ok: true, results });
}
