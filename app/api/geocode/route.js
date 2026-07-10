// GET /api/geocode?q=<address> — geocodes a free-text address to { lat, lng }
// via OpenStreetMap Nominatim. Server-side so we can set a proper User-Agent
// (Nominatim requires it) and keep within its usage policy. Results are biased
// to the Seychelles. Returns { lat, lng } or { error }.
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rough bounding box of the Seychelles inner islands to bias/limit results.
const VIEWBOX = "55.2,-5.0,56.0,-4.2"; // left,top,right,bottom (lon,lat)

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q || !q.trim()) return NextResponse.json({ error: "missing_query" }, { status: 400 });

  // Always scope to the Seychelles so "Victoria" resolves locally, not elsewhere.
  const query = /seychelles/i.test(q) ? q : `${q}, Seychelles`;
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=sc" +
    `&viewbox=${encodeURIComponent(VIEWBOX)}&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim policy requires an identifying UA with contact info.
        "User-Agent": "sey.la-book/1.0 (hello@sey.la)",
        "Accept-Language": "en",
      },
    });
    if (!res.ok) return NextResponse.json({ error: "geocode_failed" }, { status: 502 });
    const rows = await res.json().catch(() => []);
    if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const lat = Number(rows[0].lat);
    const lng = Number(rows[0].lon);
    if (!isFinite(lat) || !isFinite(lng)) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ lat, lng });
  } catch (e) {
    return NextResponse.json({ error: "geocode_error" }, { status: 502 });
  }
}
