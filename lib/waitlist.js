// Waitlist — a client joins a studio's waitlist (RLS waitlist_join allows insert
// for public studios). Owner-side reads/updates live in lib/owner.js.
import { supabase } from "./supabaseClient";

export async function joinWaitlist(studioId, { name, email, phone, note, serviceId }) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!studioId || !email) return { error: "missing" };
  const { error } = await supabase.from("waitlist").insert({
    studio_id: studioId,
    service_id: serviceId || null,
    guest_name: name || null,
    guest_email: email,
    guest_phone: phone || null,
    note: note || null,
  });
  return error ? { error: error.message } : { ok: true };
}
