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
