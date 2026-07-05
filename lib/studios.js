// Server-side studio fetch, mapped to the shape StudioCard/SearchPage expect.
// Returns null on any failure (no client, network, RLS) so callers fall back
// to their built-in demo data — the UI never breaks.
import { supabase } from "./supabaseClient";

function mapStudio(r) {
  const services = (r.services || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .slice(0, 2)
    .map((s) => ({
      name: s.name,
      duration: `${s.duration_min} min`,
      price: `€${Math.round(Number(s.price_eur))}`,
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
    services,
    href: `/studio/${r.slug}`,
  };
}

export async function getStudios() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("studios")
      .select(
        "slug,name,category,island,address,photos,google_rating,google_review_count,status,services(name,duration_min,price_eur,sort,active)"
      )
      .in("status", ["active", "verified"])
      .order("google_rating", { ascending: false, nullsFirst: false });
    if (error || !data || !data.length) return null;
    return data.map(mapStudio);
  } catch {
    return null;
  }
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
      price: `€${Math.round(Number(s.price_eur))}`,
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
    category: r.category,
    location: r.address || r.island || "",
    tagline: r.tagline || r.bio || "",
    bio: r.bio || "",
    image: photos[0] || undefined,
    photos,
    rating,
    reviewCount,
    services,
    // Real reviews first (they carry per-review ratings), then any Google ones.
    reviews: [...realReviews, ...googleReviews],
  };
}

export async function getStudioBySlug(slug) {
  if (!supabase || !slug) return null;
  try {
    const { data, error } = await supabase
      .from("studios")
      .select(
        "id,slug,name,category,island,address,bio,tagline,photos,google_rating,google_review_count,google_reviews,status,services(id,name,duration_min,price_eur,category,sort,active),reviews(rating,text,guest_name,created_at)"
      )
      .eq("slug", slug)
      .in("status", ["active", "verified"])
      .maybeSingle();
    if (error || !data) return null;
    return mapStudioDetail(data);
  } catch {
    return null;
  }
}
