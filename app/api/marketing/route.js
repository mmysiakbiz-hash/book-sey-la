// POST /api/marketing — a studio owner emails their own clients (retention
// campaign). Auth = the owner's session; recipients are only their studio's
// clients (from bookings), so it can't be used to spam arbitrary addresses.
//
//   { message }  (Authorization: Bearer <owner token>) → { ok, sent, recipients }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBrevoEmail, marketingEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX = 300;

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "auth_required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const message = body && typeof body.message === "string" ? body.message.trim() : "";
  const tag = body && typeof body.tag === "string" ? body.tag.trim() : "";
  if (!message) return NextResponse.json({ error: "empty_message" }, { status: 400 });

  // Act as the owner — RLS scopes reads to studios/bookings they own.
  const supabase = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: userData } = await supabase.auth.getUser(token);
  const user = userData && userData.user;
  if (!user) return NextResponse.json({ error: "auth_invalid" }, { status: 401 });

  const { data: studio } = await supabase.from("studios").select("id, name, slug").eq("owner_id", user.id).limit(1).maybeSingle();
  if (!studio) return NextResponse.json({ error: "no_studio" }, { status: 400 });

  const { data: rows } = await supabase.from("bookings").select("guest_email").eq("studio_id", studio.id);
  let emails = Array.from(new Set((rows || []).map((r) => (r.guest_email || "").trim().toLowerCase()).filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))));

  // Optional segment: only clients tagged `tag`.
  if (tag) {
    const { data: tagged } = await supabase.from("client_notes").select("client_email").eq("studio_id", studio.id).contains("tags", [tag]);
    const allow = new Set((tagged || []).map((t) => (t.client_email || "").toLowerCase()));
    emails = emails.filter((e) => allow.has(e));
  }
  emails = emails.slice(0, MAX);
  if (emails.length === 0) return NextResponse.json({ ok: true, sent: 0, recipients: 0 });

  const origin = new URL(req.url).origin;
  const { subject, html } = marketingEmail({ studioName: studio.name, message, bookUrl: `${origin}/studio/${studio.slug}` });

  let sent = 0;
  for (const to of emails) {
    const r = await sendBrevoEmail({ to, subject, html });
    if (!r.error) sent++;
  }
  return NextResponse.json({ ok: true, sent, recipients: emails.length });
}
