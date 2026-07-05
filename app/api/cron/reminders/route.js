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
import { sendBrevoEmail, bookingReminderEmail } from "@/lib/email";

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
    if (!b.email) continue;
    const { subject, html } = bookingReminderEmail({
      studioName: b.studio_name || "",
      serviceName: b.service_name || "",
      whenText: whenText(b.starts_at),
      kind,
    });
    const mail = await sendBrevoEmail({ to: b.email, subject, html });
    if (!mail.error) sentIds.push(b.id);
    else console.error(`[cron] ${kind} reminder email failed for ${b.id}:`, mail.error);
  }

  // Flip the flag only for the ones that actually went out, so transient email
  // failures get retried on the next run instead of being silently dropped.
  if (sentIds.length) {
    const { error: upErr } = await supabase.from("bookings").update({ [flag]: true }).in("id", sentIds);
    if (upErr) console.error(`[cron] ${kind} flag update failed:`, upErr.message);
  }
  return { kind, due: due.length, sent: sentIds.length };
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

  const results = [];
  results.push(await processKind(supabase, "24h"));
  results.push(await processKind(supabase, "2h"));

  return NextResponse.json({ ok: true, results });
}
