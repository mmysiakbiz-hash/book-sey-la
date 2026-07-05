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

  // Pre-listed (unclaimed) studios aren't bookable until an owner claims them.
  const { data: studioRow } = await supabase
    .from("studios").select("status, owner_id").eq("id", body.studioId).maybeSingle();
  if (studioRow && (studioRow.status === "unclaimed" || !studioRow.owner_id)) {
    return NextResponse.json({ error: "studio_unclaimed" }, { status: 409 });
  }

  const start = new Date(body.startsAt);
  const end = new Date(start.getTime() + (body.durationMin || 60) * 60000);
  const during = `[${start.toISOString()},${end.toISOString()})`;

  // Reject slots the studio has blocked off (time off / day off).
  try {
    const { data: blocked } = await supabase.rpc("is_blocked", { sid: body.studioId, p: during });
    if (blocked) return NextResponse.json({ error: "studio_unavailable" }, { status: 409 });
  } catch (e) { /* non-fatal */ }

  // A client "acquired" via sey.la = one with no prior booking at this studio.
  // Their first booking carries a 20% commission; regulars a studio imported
  // itself already have history, so they don't. (RLS lets the user read their
  // own bookings, which is all we need to detect a first-time visit.)
  const { count: priorCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("studio_id", body.studioId)
    .eq("customer_id", user.id);
  const isNewClient = (priorCount || 0) === 0;
  const price = body.priceEur != null ? Number(body.priceEur) : null;
  const commissionDue = isNewClient && price != null ? Math.round(price * 0.20 * 100) / 100 : 0;

  // Carry a display name/email so the studio owner sees who's coming (owners
  // can't read auth.users). The customer sharing this with the studio is expected.
  const displayName = (user.user_metadata && user.user_metadata.name) || null;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      studio_id: body.studioId,
      service_id: body.serviceId || null,
      staff_id: body.staffId || null,
      customer_id: user.id,
      during,
      status: "confirmed",
      price_eur: price,
      source: "web",
      is_new_client: isNewClient,
      commission_due: commissionDue,
      guest_name: displayName,
      guest_email: user.email || null,
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
  if (mail.error) console.error("[book] confirmation email failed:", mail.error);

  return NextResponse.json({ ok: true, booking, emailed: !mail.error, emailError: mail.error || null });
}
