// Server-side studio fetch, mapped to the shape StudioCard/SearchPage expect.
// Returns null on any failure (no client, network, RLS) so callers fall back
// to their built-in demo data — the UI never breaks.
import { supabase } from "./supabaseClient";
import { unstable_noStore as noStore } from "next/cache";
import { scr } from "./money";

function mapStudio(r) {
  const services = (r.services || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .slice(0, 2)
    .map((s) => ({
      name: s.name,
      duration: `${s.duration_min} min`,
      price: scr(s.price_eur),
    }));
  const photos = Array.isArray(r.photos) ? r.photos : [];
  return {
    slug: r.slug,
    name: r.name,
    location: r.address || r.island || "",
    category: r.category,
    image: photos[0] || undefined,
    rating: r.google_rating != null ? Number(r.google_rating) : undefined,
    reviews: r.google_review_count || undefined,
    lat: r.lat != null ? Number(r.lat) : null,
    lng: r.lng != null ? Number(r.lng) : null,
    services,
    href: `/studio/${r.slug}`,
  };
}

export async function getStudios() {
  noStore(); // never serve a Data-Cached studio list (it once cached the seed studios)
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("studios")
      .select(
        "slug,name,category,island,address,lat,lng,photos,google_rating,google_review_count,status,services(name,duration_min,price_eur,sort,active)"
      )
      .in("status", ["active", "verified"])
      .order("google_rating", { ascending: false, nullsFirst: false });
    if (error || !data || !data.length) return null;
    return data.map(mapStudio);
  } catch {
    return null;
  }
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // day_of_week 0..6
const hm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

// business_hours rows → [["Mon","9:00 – 18:00"], …] for open days, in week order.
function formatHours(rows) {
  if (!Array.isArray(rows) || !rows.length) return [];
  return rows
    .filter((h) => h && h.open_min != null && h.close_min != null && h.close_min > h.open_min)
    .sort((a, b) => a.day_of_week - b.day_of_week)
    .map((h) => [DAY_LABELS[h.day_of_week] || "", `${hm(h.open_min)} – ${hm(h.close_min)}`]);
}

// Coarse "x days ago" style label for a timestamp.
function relativeTime(ts) {
  const then = new Date(ts).getTime();
  if (!then) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year${days < 730 ? "" : "s"} ago`;
}

// Full studio detail for the venue page (all services + gallery + reviews).
function mapStudioDetail(r) {
  const photos = Array.isArray(r.photos) ? r.photos : [];
  const services = (r.services || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((s) => ({
      id: s.id,
      name: s.name,
      dur: `${s.duration_min} min`,
      durationMin: s.duration_min,
      priceEur: s.price_eur != null ? Number(s.price_eur) : null,
      price: scr(s.price_eur),
      group: s.category || r.category || "Treatments",
    }));
  // Real reviews submitted through sey.la (reviews table), newest first.
  const realReviews = (Array.isArray(r.reviews) ? r.reviews : [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((rv) => ({
      name: rv.guest_name || "Guest",
      when: relativeTime(rv.created_at),
      text: rv.text || "",
      rating: rv.rating != null ? Number(rv.rating) : 5,
    }));
  const googleReviews = Array.isArray(r.google_reviews) ? r.google_reviews : [];

  // When we have real reviews, the headline score/count reflects them; otherwise
  // fall back to the imported Google score.
  const realRated = realReviews.filter((x) => x.rating);
  const rating = realRated.length
    ? Math.round((realRated.reduce((n, x) => n + x.rating, 0) / realRated.length) * 10) / 10
    : (r.google_rating != null ? Number(r.google_rating) : undefined);
  const reviewCount = realReviews.length || r.google_review_count || undefined;

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    unclaimed: r.status === "unclaimed" || !r.owner_id,
    category: r.category,
    location: r.address || r.island || "",
    tagline: r.tagline || r.bio || "",
    bio: r.bio || "",
    image: photos[0] || undefined,
    photos,
    rating,
    reviewCount,
    services,
    hours: formatHours(r.business_hours),
    loyalty: (() => {
      const lp = Array.isArray(r.loyalty_programs) ? r.loyalty_programs[0] : r.loyalty_programs;
      return lp && lp.active && lp.stamps_required ? { stamps: lp.stamps_required, reward: lp.reward || "" } : null;
    })(),
    socials: r.socials && typeof r.socials === "object" ? r.socials : {},
    whatsapp: r.whatsapp || "",
    packages: (Array.isArray(r.packages) ? r.packages : [])
      .filter((p) => p.active !== false)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        kind: p.kind === "membership" ? "membership" : "package",
        credits: p.credits != null ? Number(p.credits) : null,
        priceEur: p.price_eur != null ? Number(p.price_eur) : null,
      })),
    team: (Array.isArray(r.staff) ? r.staff : []).filter((s) => s.active !== false).map((s) => ({ id: s.id, name: s.name, role: s.role || "" })),
    // Real reviews first (they carry per-review ratings), then any Google ones.
    reviews: [...realReviews, ...googleReviews],
  };
}

// Upcoming public classes for a studio (with live spots left), via the
// SECURITY DEFINER rpc so anon can see counts without reading attendee rows.
export async function getStudioClasses(studioId) {
  if (!supabase || !studioId) return [];
  try {
    const { data, error } = await supabase.rpc("class_sessions_public", { p_studio: studioId });
    if (error || !data) return [];
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || "",
      startsAt: c.starts_at,
      endsAt: c.ends_at,
      capacity: c.capacity,
      spotsLeft: c.spots_left,
      priceEur: c.price_eur != null ? Number(c.price_eur) : null,
      staff: c.staff_name || "",
    }));
  } catch { return []; }
}

export async function getStudioBySlug(slug) {
  noStore();
  if (!supabase || !slug) return null;
  try {
    const { data, error } = await supabase
      .from("studios")
      .select(
        "id,slug,name,category,island,address,bio,tagline,whatsapp,socials,photos,owner_id,google_rating,google_review_count,google_reviews,status,services(id,name,duration_min,price_eur,category,sort,active),staff(id,name,role,active),business_hours(day_of_week,open_min,close_min),loyalty_programs(stamps_required,reward,active),packages(id,name,description,price_eur,kind,credits,sort,active),reviews(rating,text,guest_name,created_at)"
      )
      .eq("slug", slug)
      .in("status", ["active", "verified", "unclaimed"])
      .maybeSingle();
    if (error || !data) return null;
    return mapStudioDetail(data);
  } catch {
    return null;
  }
}
