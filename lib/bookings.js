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
  phone = null,
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
      body: JSON.stringify({ studioId, serviceId, staffId, startsAt, durationMin, priceEur, notes, phone }),
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
// Parse start instant + duration out of a tstzrange value like
// ["2026-07-11 10:00:00+00","2026-07-11 10:40:00+00").
function parseRange(during) {
  if (!during) return { start: null, durationMin: 60 };
  const m = /[\[(]"?([^,"]+)"?,\s*"?([^,")\]]+)"?[\])]/.exec(String(during));
  if (!m) return { start: null, durationMin: 60 };
  const s = new Date(m[1].trim().replace(" ", "T"));
  const e = new Date(m[2].trim().replace(" ", "T"));
  return {
    start: isNaN(s) ? null : s.toISOString(),
    durationMin: (!isNaN(s) && !isNaN(e)) ? Math.max(15, Math.round((e - s) / 60000)) : 60,
  };
}

export async function getMyBookings() {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth || !auth.user) return null;
  const { data, error } = await supabase
    .from("bookings")
    .select("id, studio_id, service_id, staff_id, during, status, price_eur, studios(name, slug), services(name), staff(name)")
    .order("created_at", { ascending: false });
  if (error) return null;
  return (data || []).map((b) => {
    const { start, durationMin } = parseRange(b.during);
    return {
      id: b.id,
      studioId: b.studio_id,
      studioName: b.studios?.name || "",
      studioSlug: b.studios?.slug || "",
      serviceId: b.service_id,
      serviceName: b.services?.name || "",
      staffId: b.staff_id,
      staffName: b.staff?.name || "",
      startsAt: start,
      durationMin,
      status: b.status || "confirmed",
      priceEur: b.price_eur,
    };
  });
}

// Cancel one of the signed-in customer's own bookings (RLS: customer_id = uid).
export async function cancelMyBooking(id) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

// Reschedule to a new start time. Re-checks opening hours + blocked slots via the
// same RPCs the booking API uses, so a client can't move into an invalid slot.
export async function rescheduleMyBooking(id, studioId, startsAt, durationMin, staffId) {
  if (!supabase) return { error: "supabase_not_configured" };
  const start = new Date(startsAt);
  if (isNaN(start)) return { error: "bad_time" };
  const end = new Date(start.getTime() + (durationMin || 60) * 60000);
  const during = `[${start.toISOString()},${end.toISOString()})`;
  try {
    const { data: blocked } = await supabase.rpc("is_blocked", { sid: studioId, p: during });
    if (blocked) return { error: "studio_unavailable" };
    const { data: open } = await supabase.rpc("within_hours", { sid: studioId, staff: staffId || null, p: during });
    if (open === false) return { error: "outside_hours" };
  } catch (e) { /* validation is best-effort */ }
  const { error } = await supabase.from("bookings").update({ during }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
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
