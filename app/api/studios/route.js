// GET /api/studios — live studios from the book-seyla Supabase project.
// Proves the app ↔ Supabase pipe end to end (reads through the public RLS policy).
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)." },
      { status: 503 }
    );
  }
  const { data, error } = await supabase
    .from("studios")
    .select("id, slug, name, category, island, address, tagline, photos, google_rating, google_review_count, status")
    .in("status", ["active", "verified"])
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, count: data.length, studios: data });
}
