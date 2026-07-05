// POST /api/admin/stats — real admin dashboard data. Admin-only (ADMIN_TOKEN),
// service role (reads across all studios).
//   { token } → { studios:{...counts, list}, bookings, classes, reviews, referrals }
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const db = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
  const count = async (table) => (await db.from(table).select("id", { count: "exact", head: true })).count || 0;

  const [{ data: studios }, { data: refs }, bookings, classes, reviews] = await Promise.all([
    db.from("studios").select("name, slug, status, owner_email, created_at, billing_blocked").order("created_at", { ascending: false }),
    db.from("referrals").select("status"),
    count("bookings"),
    count("class_sessions"),
    count("reviews"),
  ]);

  const byStatus = (rows, s) => (rows || []).filter((r) => r.status === s).length;
  const studioRows = studios || [];
  const refRows = refs || [];

  return NextResponse.json({
    studios: {
      total: studioRows.length,
      active: byStatus(studioRows, "active"),
      verified: byStatus(studioRows, "verified"),
      unclaimed: byStatus(studioRows, "unclaimed"),
      draft: byStatus(studioRows, "draft"),
      rejected: byStatus(studioRows, "rejected"),
      blocked: studioRows.filter((r) => r.billing_blocked).length,
      list: studioRows.slice(0, 100).map((r) => ({ name: r.name, slug: r.slug, status: r.status, ownerEmail: r.owner_email || "", createdAt: r.created_at })),
    },
    bookings,
    classes,
    reviews,
    referrals: { pending: byStatus(refRows, "pending"), completed: byStatus(refRows, "completed"), total: refRows.length },
  });
}
