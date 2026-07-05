// Booking writes against the book-seyla Supabase schema.
// RLS (bookings_insert with_check: customer_id = auth.uid()) requires an
// authenticated Supabase user, so createBooking needs a live session.
import { supabase } from "./supabaseClient";

/**
 * Create a booking for the signed-in customer.
 * @param {object} p
 * @param {string} p.studioId   studios.id (uuid)
 * @param {string} [p.serviceId]
 * @param {string} [p.staffId]
 * @param {string|Date} p.startsAt  ISO string or Date
 * @param {number} [p.durationMin=60]
 * @param {number} [p.priceEur]
 * @param {string} [p.notes]
 * @returns {Promise<{data?:object, error?:string}>}
 */
export async function createBooking({
  studioId,
  serviceId = null,
  staffId = null,
  startsAt,
  durationMin = 60,
  priceEur = null,
  notes = null,
}) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!studioId || !startsAt) return { error: "missing_studio_or_time" };

  // Need a live session to authorise the write (and to email the customer).
  const { data: sess } = await supabase.auth.getSession();
  const session = sess && sess.session;
  if (!session) return { error: "auth_required" };

  // Insert + confirmation email happen server-side (/api/book) so the Brevo key
  // and the write stay off the client. RLS still binds customer_id to the user.
  let json;
  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ studioId, serviceId, staffId, startsAt, durationMin, priceEur, notes }),
    });
    json = await res.json().catch(() => ({ error: `http_${res.status}` }));
    if (!res.ok || json.error) return { error: json.error || `http_${res.status}` };
  } catch (e) {
    return { error: "network_error" };
  }
  // A tstzrange EXCLUDE constraint (double-booking guard) surfaces as json.error.
  return { data: json.booking, emailed: json.emailed };
}

/** Bookings for the signed-in customer (RLS: customer_id = auth.uid()). */
export async function getMyBookings() {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth || !auth.user) return null;
  const { data, error } = await supabase
    .from("bookings")
    .select("id, studio_id, service_id, staff_id, during, status, price_eur")
    .order("created_at", { ascending: false });
  if (error) return null;
  return data;
}

// Loyalty progress for the signed-in client, per studio they've visited.
export async function getMyRewards() {
  if (!supabase) return [];
  const { data: auth } = await supabase.auth.getUser();
  if (!auth || !auth.user) return [];
  const { data: bk } = await supabase.from("bookings").select("studio_id, status, studios(name, slug)");
  if (!bk || !bk.length) return [];
  const visits = new Map(); // studio_id -> { name, slug, count }
  for (const b of bk) {
    if (b.status === "cancelled") continue;
    const s = visits.get(b.studio_id) || { studioId: b.studio_id, name: (b.studios && b.studios.name) || "Studio", slug: b.studios && b.studios.slug, count: 0 };
    s.count += 1;
    visits.set(b.studio_id, s);
  }
  const ids = Array.from(visits.keys());
  if (!ids.length) return [];
  const { data: lps } = await supabase.from("loyalty_programs").select("studio_id, stamps_required, reward, active").in("studio_id", ids);
  const prog = new Map((lps || []).filter((l) => l.active && l.stamps_required).map((l) => [l.studio_id, l]));
  return Array.from(visits.values())
    .filter((v) => prog.has(v.studioId))
    .map((v) => {
      const p = prog.get(v.studioId);
      const req = p.stamps_required;
      const stamps = v.count % req === 0 && v.count > 0 ? req : v.count % req; // rough card progress
      return { studioId: v.studioId, name: v.name, slug: v.slug, stamps, required: req, reward: p.reward || "reward", eligible: v.count >= req };
    });
}
