// POST /api/claim — pre-listed ("unclaimed") studio takeover (Task N).
//
//   { action: "start",  slug, email }         → email must match the listing's
//        owner_email on file; sends a Brevo magic link so they can sign in.
//   { action: "finish" }  (Bearer token)      → after sign-in, assigns any
//        unclaimed listing whose owner_email = the session email to this user
//        (owner_id = uid, status → draft). Idempotent.
//   { action: "reject", studioId } (Bearer)   → "not interested": hides the
//        listing (status → rejected). Allowed for the owner or the matching email.
//
// Requires: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
// SUPABASE_SERVICE_ROLE_KEY, BREVO_API_KEY.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, magicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
function admin() {
  const { url, service } = env();
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
}
async function sessionEmail(token) {
  const { url, anon } = env();
  const c = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data } = await c.auth.getUser(token);
  return { user: (data && data.user) || null };
}

export async function GET(req) {
  const { url, anon, service } = env();
  if (!url || !anon || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { data } = await admin()
    .from("studios").select("name, owner_email, status, owner_id").eq("slug", slug).maybeSingle();
  if (!data) return NextResponse.json({ claimable: false });
  const claimable = data.status === "unclaimed" && !data.owner_id;
  // Hint which email is on file, masked (e.g. j***@gmail.com), to guide the owner.
  let hint = "";
  if (claimable && data.owner_email) {
    const [u, dom] = data.owner_email.split("@");
    hint = (u ? u[0] : "") + "***@" + (dom || "");
  }
  return NextResponse.json({ claimable, name: data.name || "", emailHint: hint });
}

export async function POST(req) {
  const { url, anon, service } = env();
  if (!url || !anon || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await req.json().catch(() => null);
  const action = body && body.action;
  const db = admin();

  if (action === "start") {
    const slug = body.slug;
    const email = (body.email || "").trim();
    if (!slug || !email) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    const { data: studio } = await db
      .from("studios").select("id, owner_email, name")
      .eq("slug", slug).eq("status", "unclaimed").is("owner_id", null).maybeSingle();
    if (!studio) return NextResponse.json({ error: "not_claimable" }, { status: 404 });
    if (!studio.owner_email || studio.owner_email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "email_mismatch" }, { status: 403 });
    }
    const origin = new URL(req.url).origin;
    const { data: link, error: linkErr } = await db.auth.admin.generateLink({
      type: "magiclink", email, options: { redirectTo: origin + "/panel" },
    });
    if (linkErr || !link || !link.properties) return NextResponse.json({ error: "link_failed" }, { status: 400 });
    const { subject, html } = magicLinkEmail({ actionLink: link.properties.action_link });
    const mail = await sendBrevoEmail({ to: email, subject, html });
    if (mail.error) return NextResponse.json({ error: mail.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "auth_required" }, { status: 401 });
  const { user } = await sessionEmail(token);
  if (!user || !user.email) return NextResponse.json({ error: "auth_invalid" }, { status: 401 });

  if (action === "finish") {
    const { data: studio } = await db
      .from("studios").select("id, slug")
      .eq("status", "unclaimed").is("owner_id", null)
      .ilike("owner_email", user.email).maybeSingle();
    if (!studio) return NextResponse.json({ claimed: null });
    const { error } = await db.from("studios").update({ owner_id: user.id, status: "draft" }).eq("id", studio.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ claimed: studio.id, slug: studio.slug });
  }

  if (action === "reject") {
    const studioId = body.studioId;
    if (!studioId) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    const { data: studio } = await db.from("studios").select("id, owner_id, owner_email, status").eq("id", studioId).maybeSingle();
    if (!studio) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const mine = studio.owner_id === user.id ||
      (studio.status === "unclaimed" && studio.owner_email && studio.owner_email.toLowerCase() === user.email.toLowerCase());
    if (!mine) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const { error } = await db.from("studios").update({ status: "rejected", billing_blocked: true }).eq("id", studioId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
