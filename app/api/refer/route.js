// POST /api/refer — invite a studio (Task K3).
//
// referrals has no client INSERT policy, so the write goes through the service
// role. The referrer email is taken from the caller's verified session (not the
// body), so it can't be spoofed. Credit is only granted later, by a DB trigger,
// when the invited studio actually goes live — so inviting costs nothing and
// can't be gamed.
//
//   POST { email }  (Authorization: Bearer <user token>) → { ok } | { error }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CREDIT_EUR = 15;

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !serviceKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "auth_required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const email = body && typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Verify the caller and get their email (the referrer).
  const asUser = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: userData } = await asUser.auth.getUser(token);
  const referrer = userData && userData.user && userData.user.email;
  if (!referrer) return NextResponse.json({ error: "auth_invalid" }, { status: 401 });
  if (referrer.toLowerCase() === email.toLowerCase()) {
    return NextResponse.json({ error: "cannot_refer_yourself" }, { status: 400 });
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await admin.from("referrals").insert({
    referrer_email: referrer,
    referred_email: email,
    status: "pending",
    credit_eur: CREDIT_EUR,
  });
  if (error) {
    if ((error.code || "") === "23505") return NextResponse.json({ error: "already_invited" }, { status: 409 });
    console.error("[refer] insert failed:", error.message);
    return NextResponse.json({ error: "could_not_invite" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, credit: CREDIT_EUR });
}
