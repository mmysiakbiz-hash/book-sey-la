// /api/review — submit a post-visit review (Task E).
//
// The reviews table has no client INSERT policy, so writes go through here with
// the service role. Access is authorised by a signed token (from the review
// request email), not a login — so guests can review too.
//
//   GET  ?bookingId=&token=  → { studioName, serviceName, alreadyReviewed }
//   POST { bookingId, token, rating (1-5), text?, guestName? } → { ok }
//
// Requires (server-only): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// and REVIEW_SECRET (or CRON_SECRET) for token signing.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyReviewToken } from "@/lib/reviewToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function loadBooking(supabase, bookingId) {
  const { data } = await supabase
    .from("bookings")
    .select("id, studio_id, service_id, guest_name, guest_email, during, status, studios(name), services(name)")
    .eq("id", bookingId)
    .maybeSingle();
  return data;
}

export async function GET(req) {
  const supabase = admin();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const token = searchParams.get("token");
  if (!bookingId || !verifyReviewToken(bookingId, token)) {
    return NextResponse.json({ error: "invalid_link" }, { status: 401 });
  }
  const booking = await loadBooking(supabase, bookingId);
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("booking_id", bookingId);

  return NextResponse.json({
    ok: true,
    studioName: (booking.studios && booking.studios.name) || "",
    serviceName: (booking.services && booking.services.name) || "",
    guestName: booking.guest_name || "",
    alreadyReviewed: (count || 0) > 0,
  });
}

export async function POST(req) {
  const supabase = admin();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const bookingId = body && body.bookingId;
  const token = body && body.token;
  const rating = body && Number(body.rating);
  const text = body && typeof body.text === "string" ? body.text.trim().slice(0, 2000) : null;
  const guestName = body && typeof body.guestName === "string" ? body.guestName.trim().slice(0, 120) : null;

  if (!bookingId || !verifyReviewToken(bookingId, token)) {
    return NextResponse.json({ error: "invalid_link" }, { status: 401 });
  }
  if (!(rating >= 1 && rating <= 5)) {
    return NextResponse.json({ error: "invalid_rating" }, { status: 400 });
  }

  const booking = await loadBooking(supabase, bookingId);
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { error } = await supabase.from("reviews").insert({
    studio_id: booking.studio_id,
    booking_id: bookingId,
    guest_name: guestName || booking.guest_name || null,
    guest_email: booking.guest_email || null,
    rating: Math.round(rating),
    text: text || null,
  });

  if (error) {
    // Unique violation on booking_id → already reviewed.
    if ((error.code || "") === "23505") return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
    console.error("[review] insert failed:", error.message);
    return NextResponse.json({ error: "could_not_save" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
