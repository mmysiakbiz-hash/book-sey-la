// POST /api/admin — admin data + actions. ADMIN_TOKEN-gated, service role.
//   { token, action, ... }
//     action "bi"           → { bi }
//     action "studios"      → { studios: [...] }
//     action "bookings"     → { bookings: [...] }
//     action "users"        → { users: [...] }
//     action "studio"       → { studioId, op: setStatus|markPaid|block|unblock|delete, value? }
//     action "booking"      → { bookingId, op: cancel|complete }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["draft", "unclaimed", "active", "verified", "rejected"];

function startOf(during) {
  const m = (during || "").match(/["\[]?\s*"?([^",\]]+)/);
  return m ? m[1] : null;
}

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_TOKEN;
  if (!url || !service) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!adminToken) return NextResponse.json({ error: "admin_token_not_set" }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body || body.token !== adminToken) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
  const action = body.action;

  if (action === "bi") {
    const { data, error } = await db.rpc("admin_bi");
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
