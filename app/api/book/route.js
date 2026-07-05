// POST /api/book — create a booking as the signed-in user, then email confirmation.
// Runs server-side so BREVO_API_KEY (and the insert) never touch the client.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, bookingConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "auth_required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.studioId || !body.startsAt) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Act as the user so RLS (customer_id = auth.uid()) is enforced with their identity.
  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData } = await supabase.auth.getUser(token);
  const user = userData && userData.user;
  if (!user) return NextResponse.json({ error: "auth_invalid" }, { status: 401 });

  const start = new Date(body.startsAt);
  const end = new Date(start.getTime() + (body.durationMin || 60) * 60000);
  const during = `[${start.toISOString()},${end.toISOString()})`;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      studio_id: body.studioId,
      service_id: body.serviceId || null,
      staff_id: body.staffId || null,
      customer_id: user.id,
      during,
      status: "confirmed",
      price_eur: body.priceEur != null ? body.priceEur : null,
      source: "web",
      is_new_client: false,
      notes: body.notes || null,
    })
    .select("id, during, status, price_eur")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Look up names for the email (public read); best-effort.
  let studioName = "";
  let serviceName = "";
  try {
    const { data: s } = await supabase.from("studios").select("name").eq("id", body.studioId).maybeSingle();
    studioName = (s && s.name) || "";
    if (body.serviceId) {
      const { data: sv } = await supabase.from("services").select("name").eq("id", body.serviceId).maybeSingle();
      serviceName = (sv && sv.name) || "";
    }
  } catch {}

  const whenText = start.toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe",
  });
  const priceText = body.priceEur != null ? `€${Math.round(body.priceEur)}` : "";
  const { subject, html } = bookingConfirmationEmail({ studioName, serviceName, whenText, priceText });

  // Email is best-effort — the booking is already saved either way.
  const mail = await sendBrevoEmail({ to: user.email, subject, html });

  return NextResponse.json({ ok: true, booking, emailed: !mail.error, emailError: mail.error || null });
}
