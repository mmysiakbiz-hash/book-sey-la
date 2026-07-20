// POST /api/prospect — spin up a pre-listed ("unclaimed") studio page for one
// prospect, ready to send. Admin-only (ADMIN_TOKEN). Fills gaps from category
// presets so even name + city + category yields a finished-looking page.
//
//   { token, name, category, email, island?, address?, tagline?, bio?, phone?,
//     photos?[], services?[{name,duration_min,price_eur}] }
//   → { ok, slug, studioUrl, claimUrl }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";
import { presetFor } from "@/lib/prospectPresets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Constant-time token compare (avoids leaking length/prefix via timing).
function tokenMatches(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length || !a) return false;
  try { return timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; }
}

// Same auth model as /api/admin: a valid ADMIN_TOKEN OR an admin session
// (row in `admins`, or first login by an ADMIN_EMAILS address → auto-enrol).
async function isAdmin(req, body, { url, anon, db }) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && body && tokenMatches(body.token, adminToken)) return true;
  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (bearer && anon) {
    const asUser = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await asUser.auth.getUser(bearer);
    const user = data && data.user;
    if (user) {
      const { data: row } = await db.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (row) return true;
      const allow = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (user.email && allow.includes(user.email.toLowerCase())) {
        await db.from("admins").upsert({ user_id: user.id }, { onConflict: "user_id" });
        return true;
      }
    }
  }
  return false;
}

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!process.env.ADMIN_TOKEN && !process.env.ADMIN_EMAILS) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const db = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
  if (!(await isAdmin(req, body || {}, { url, anon, db }))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const name = (body.name || "").trim();
  const category = (body.category || "").trim();
  const email = (body.email || "").trim();
  if (!name || !category) return NextResponse.json({ error: "name_and_category_required" }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const preset = presetFor(category);

  const { data: slug, error: slugErr } = await db.rpc("gen_studio_slug", { p_name: name });
  if (slugErr) return NextResponse.json({ error: slugErr.message }, { status: 400 });

  const photos = Array.isArray(body.photos) && body.photos.length ? body.photos : preset.photos;
  const { data: studio, error } = await db.from("studios").insert({
    owner_id: null,
    owner_email: email || null,
    name,
    slug,
    category,
    island: body.island || null,
    address: body.address || null,
    tagline: (body.tagline || preset.tagline) || null,
    bio: (body.bio || preset.bio) || null,
    photos,
    whatsapp: body.phone || null,
    status: "unclaimed",
  }).select("id, slug").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const services = (Array.isArray(body.services) && body.services.length ? body.services : preset.services)
    .filter((s) => s && s.name)
    .map((s, i) => ({
      studio_id: studio.id,
      name: String(s.name).trim(),
      duration_min: Number(s.duration_min) || 60,
      price_eur: s.price_eur === "" || s.price_eur == null ? null : Number(s.price_eur),
      category,
      active: true,
      sort: i,
    }));
  if (services.length) await db.from("services").insert(services);

  const hours = preset.hours.map((h) => ({ studio_id: studio.id, day_of_week: h.day_of_week, open_min: h.open_min, close_min: h.close_min }));
  await db.from("business_hours").insert(hours);

  const origin = new URL(req.url).origin;
  return NextResponse.json({
    ok: true,
    slug: studio.slug,
    studioUrl: `${origin}/studio/${studio.slug}`,
    claimUrl: `${origin}/claim/${studio.slug}`,
  });
}
