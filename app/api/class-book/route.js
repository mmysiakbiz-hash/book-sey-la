// POST /api/class-book — join a class (Task H).
//
// class_bookings has no client INSERT policy, so the write goes through here with
// the service role, which also lets us enforce capacity (count vs class capacity)
// atomically-enough for our scale. Public join (guest), no login required.
//
//   POST { sessionId, name, email, phone? } → { ok, spotsLeft } | { error }
//
// Requires (server-only): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BREVO_API_KEY.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, classConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const sessionId = body && body.sessionId;
  const name = body && typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = body && typeof body.email === "string" ? body.email.trim() : "";
  const phone = body && typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : null;
  if (!sessionId) return NextResponse.json({ error: "missing_session" }, { status: 400 });
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: session } = await supabase
    .from("class_sessions")
    .select("id, studio_id, name, during, capacity, price_eur, status, studios(name)")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if ((session.status || "active") === "cancelled") return NextResponse.json({ error: "cancelled" }, { status: 409 });

  const { count } = await supabase
    .from("class_bookings")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .neq("status", "cancelled");
  const taken = count || 0;
  if (session.capacity != null && taken >= session.capacity) {
    return NextResponse.json({ error: "full", spotsLeft: 0 }, { status: 409 });
  }

  const { error } = await supabase.from("class_bookings").insert({
    session_id: sessionId,
    studio_id: session.studio_id,
    guest_name: name || null,
    guest_email: email,
    guest_phone: phone,
    status: "confirmed",
  });
  if (error) {
    if ((error.code || "") === "23505") return NextResponse.json({ error: "already_joined" }, { status: 409 });
    console.error("[class-book] insert failed:", error.message);
    return NextResponse.json({ error: "could_not_book" }, { status: 400 });
  }

  // Confirmation email (best-effort).
  const start = session.during ? new Date((session.during.match(/["\[]?\s*"?([^",\]]+)/) || [])[1]) : null;
  const whenText = start && !isNaN(start)
    ? start.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" })
    : "";
  const priceText = session.price_eur != null ? `€${Math.round(Number(session.price_eur))}` : "";
  const { subject, html } = classConfirmationEmail({
    studioName: (session.studios && session.studios.name) || "",
    className: session.name || "Class",
    whenText, priceText,
  });
  const mail = await sendBrevoEmail({ to: email, subject, html });
  if (mail.error) console.error("[class-book] email failed:", mail.error);

  const spotsLeft = session.capacity != null ? Math.max(0, session.capacity - taken - 1) : null;
  return NextResponse.json({ ok: true, spotsLeft, emailed: !mail.error });
}
