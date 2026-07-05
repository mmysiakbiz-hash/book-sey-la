// POST /api/prospect — spin up a pre-listed ("unclaimed") studio page for one
// prospect, ready to send. Admin-only (ADMIN_TOKEN). Fills gaps from category
// presets so even name + city + category yields a finished-looking page.
//
//   { token, name, category, email, island?, address?, tagline?, bio?, phone?,
//     photos?[], services?[{name,duration_min,price_eur}] }
//   → { ok, slug, studioUrl, claimUrl }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { presetFor } from "@/lib/prospectPresets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_TOKEN;
  if (!url || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!adminToken) return NextResponse.json({ error: "admin_token_not_set" }, { status: 503 });

  const body = await req.json().catch(() => null);
  if (!body || body.token !== adminToken) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const name = (body.name || "").trim();
  const category = (body.category || "").trim();
  const email = (body.email || "").trim();
  if (!name || !category) return NextResponse.json({ error: "name_and_category_required" }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const preset = presetFor(category);
  const db = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

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
