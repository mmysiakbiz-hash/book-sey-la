// POST /api/admin — admin data + actions. Service role.
// Two ways to authenticate (either is sufficient):
//   1. Static token   — body.token === ADMIN_TOKEN (fallback / break-glass).
//   2. Admin login     — Authorization: Bearer <supabase session> where the user
//      is a row in `admins`. A first login by an email listed in ADMIN_EMAILS
//      auto-enrols that user into `admins` (bootstrap), so no manual seeding.
//   { token, action, ... }
//     action "bi"           → { bi }
//     action "studios"      → { studios: [...] }
//     action "bookings"     → { bookings: [...] }
//     action "users"        → { users: [...] }
//     action "studio"       → { studioId, op: setStatus|markPaid|block|unblock|delete, value? }
//     action "booking"      → { bookingId, op: cancel|complete }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["draft", "unclaimed", "active", "verified", "rejected"];

// Constant-time token compare (avoids leaking length/prefix via timing).
function tokenMatches(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length || !a) return false;
  try { return timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; }
}

function startOf(during) {
  const m = (during || "").match(/["\[]?\s*"?([^",\]]+)/);
  return m ? m[1] : null;
}

// Returns an auth context ({ via, user? }) if the caller is an admin, else null.
async function authorize(req, body, { url, anon, service, db }) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && body && tokenMatches(body.token, adminToken)) {
    return { via: "token" };
  }
  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (bearer && anon) {
    const asUser = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await asUser.auth.getUser(bearer);
    const user = data && data.user;
    if (user) {
      const { data: row } = await db.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (row) return { via: "session", user };
      const allow = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (user.email && allow.includes(user.email.toLowerCase())) {
        await db.from("admins").upsert({ user_id: user.id }, { onConflict: "user_id" });
        return { via: "bootstrap", user };
      }
    }
  }
  return null;
}

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await req.json().catch(() => null);

  const db = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
  const auth = await authorize(req, body || {}, { url, anon, service, db });
  if (!auth) {
    if (!process.env.ADMIN_TOKEN && !process.env.ADMIN_EMAILS) {
      return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const action = body && body.action;

  if (action === "bi") {
    const args = {};
    if (body.from) args.p_from = body.from;
    if (body.to) args.p_to = body.to;
    const { data, error } = await db.rpc("admin_bi", args);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ bi: data });
  }

  if (action === "users") {
    const { data, error } = await db.rpc("admin_users");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ users: data || [] });
  }

  if (action === "studios") {
    const { data, error } = await db.from("studios")
      .select("id, name, slug, category, status, owner_email, created_at, billing_blocked, trial_ends_at, paid_until")
      .order("created_at", { ascending: false }).limit(300);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ studios: data || [] });
  }

  if (action === "bookings") {
    const { data, error } = await db.from("bookings")
      .select("id, during, status, price_eur, commission_due, is_new_client, guest_name, guest_email, studios(name), services(name)")
      .order("created_at", { ascending: false }).limit(200);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const bookings = (data || []).map((b) => ({
      id: b.id, startsAt: startOf(b.during), status: b.status,
      price: b.price_eur != null ? Number(b.price_eur) : null,
      commission: b.commission_due != null ? Number(b.commission_due) : 0,
      newClient: !!b.is_new_client,
      client: b.guest_name || b.guest_email || "Client",
      studio: (b.studios && b.studios.name) || "",
      service: (b.services && b.services.name) || "",
    }));
    return NextResponse.json({ bookings });
  }

  if (action === "studio") {
    const { studioId, op, value } = body;
    if (!studioId || !op) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    if (op === "setStatus") {
      if (!STATUSES.includes(value)) return NextResponse.json({ error: "bad_status" }, { status: 400 });
      const { error } = await db.from("studios").update({ status: value }).eq("id", studioId);
      return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
    }
    if (op === "markPaid") {
      const until = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      const { error } = await db.from("studios").update({ paid_until: until, billing_blocked: false }).eq("id", studioId);
      return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true, paidUntil: until });
    }
    if (op === "block" || op === "unblock") {
      const { error } = await db.from("studios").update({ billing_blocked: op === "block" }).eq("id", studioId);
      return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
    }
    if (op === "delete") {
      // remove children then the studio
      await db.from("class_bookings").delete().eq("studio_id", studioId);
      await db.from("class_sessions").delete().eq("studio_id", studioId);
      await db.from("reviews").delete().eq("studio_id", studioId);
      await db.from("bookings").delete().eq("studio_id", studioId);
      await db.from("business_hours").delete().eq("studio_id", studioId);
      await db.from("staff").delete().eq("studio_id", studioId);
      await db.from("services").delete().eq("studio_id", studioId);
      const { error } = await db.from("studios").delete().eq("id", studioId);
      return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "bad_op" }, { status: 400 });
  }

  if (action === "booking") {
    const { bookingId, op } = body;
    if (!bookingId || !["cancel", "complete"].includes(op)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    const status = op === "cancel" ? "cancelled" : "completed";
    const { error } = await db.from("bookings").update({ status }).eq("id", bookingId);
    return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
