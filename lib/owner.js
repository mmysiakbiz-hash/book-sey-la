// Owner-side data layer for the studio configurator (Task G).
// Runs in the browser on the signed-in user's session; RLS (owns_studio /
// owner_id = auth.uid()) enforces that owners only touch their own studio.
import { supabase } from "./supabaseClient";

export async function getSessionUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return (data && data.user) || null;
}

// The studio owned by the signed-in user (with services, staff, hours), or null.
export async function getMyStudio() {
  if (!supabase) return { error: "supabase_not_configured" };
  const user = await getSessionUser();
  if (!user) return { user: null, studio: null };
  const { data, error } = await supabase
    .from("studios")
    .select("id, slug, name, category, island, address, lat, lng, bio, tagline, whatsapp, socials, photos, status, trial_ends_at, paid_until, billing_blocked, services(id,name,duration_min,price_eur,category,sort,active), staff(id,name,role,color,active), business_hours(id,day_of_week,open_min,close_min)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return { user, error: error.message };
  return { user, studio: data || null };
}

export async function createDraftStudio({ name, category }) {
  if (!supabase) return { error: "supabase_not_configured" };
  const user = await getSessionUser();
  if (!user) return { error: "auth_required" };
  const { data: slug, error: slugErr } = await supabase.rpc("gen_studio_slug", { p_name: name || "studio" });
  if (slugErr) return { error: slugErr.message };
  // 3 months free from registration.
  const trialEnds = new Date(Date.now() + 92 * 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from("studios")
    .insert({ owner_id: user.id, owner_email: user.email || null, name: name || "", slug, category: category || null, status: "draft", trial_ends_at: trialEnds })
    .select("id, slug")
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function updateStudio(id, patch) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("studios").update(patch).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

// Replace the whole set for a step (delete-then-insert) — simplest correct save.
export async function saveServices(studioId, items) {
  if (!supabase) return { error: "supabase_not_configured" };
  await supabase.from("services").delete().eq("studio_id", studioId);
  const rows = (items || [])
    .filter((s) => s.name && s.name.trim())
    .map((s, i) => ({
      studio_id: studioId,
      name: s.name.trim(),
      duration_min: Number(s.duration_min) || 60,
      price_eur: s.price_eur === "" || s.price_eur == null ? null : Number(s.price_eur),
      category: s.category || null,
      active: true,
      sort: i,
    }));
  if (!rows.length) return { ok: true };
  const { error } = await supabase.from("services").insert(rows);
  return error ? { error: error.message } : { ok: true };
}

export async function saveStaff(studioId, items) {
  if (!supabase) return { error: "supabase_not_configured" };
  await supabase.from("staff").delete().eq("studio_id", studioId);
  const palette = ["#C58B5B", "#7FA88A", "#B4708F", "#6E86B0", "#C7A34B"];
  const rows = (items || [])
    .filter((s) => s.name && s.name.trim())
    .map((s, i) => ({
      studio_id: studioId,
      name: s.name.trim(),
      role: s.role ? s.role.trim() : null,
      color: s.color || palette[i % palette.length],
      active: true,
    }));
  if (!rows.length) return { ok: true };
  const { error } = await supabase.from("staff").insert(rows);
  return error ? { error: error.message } : { ok: true };
}

export async function saveHours(studioId, hours) {
  if (!supabase) return { error: "supabase_not_configured" };
  await supabase.from("business_hours").delete().eq("studio_id", studioId);
  const rows = (hours || [])
    .filter((h) => h && h.open_min != null && h.close_min != null && h.close_min > h.open_min)
    .map((h) => ({ studio_id: studioId, day_of_week: h.day_of_week, open_min: h.open_min, close_min: h.close_min }));
  if (!rows.length) return { ok: true };
  const { error } = await supabase.from("business_hours").insert(rows);
  return error ? { error: error.message } : { ok: true };
}

// Upload a photo to the public studio-photos bucket, return its public URL.
export async function uploadPhoto(studioId, file) {
  if (!supabase) return { error: "supabase_not_configured" };
  const ext = (file.name && file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `${studioId}/${rand}.${ext}`;
  const { error } = await supabase.storage.from("studio-photos").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("studio-photos").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function publishStudio(id) {
  return updateStudio(id, { status: "active" });
}

// After sign-in, claim any unclaimed listing whose owner_email matches me.
export async function claimUnclaimedForMe() {
  if (!supabase) return { claimed: null };
  const { data: sess } = await supabase.auth.getSession();
  const session = sess && sess.session;
  if (!session) return { claimed: null };
  try {
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ action: "finish" }),
    });
    return await res.json().catch(() => ({ claimed: null }));
  } catch (e) { return { claimed: null }; }
}

// "Not interested" — hide a listing.
export async function rejectListing(studioId) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { data: sess } = await supabase.auth.getSession();
  const session = sess && sess.session;
  if (!session) return { error: "auth_required" };
  try {
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ action: "reject", studioId }),
    });
    const j = await res.json().catch(() => ({}));
    return res.ok && j.ok ? { ok: true } : { error: j.error || "failed" };
  } catch (e) { return { error: "network_error" }; }
}

// Bookings for the owner's studio (RLS: owns_studio). Parses the tstzrange
// `during` into start/end Dates for the agenda.
function parseRange(during) {
  if (!during || typeof during !== "string") return { start: null, end: null };
  const m = during.match(/["\[]?\s*"?([^",\]]+)"?\s*,\s*"?([^",\)\]]+)"?/);
  if (!m) return { start: null, end: null };
  const start = new Date(m[1]);
  const end = new Date(m[2]);
  return { start: isNaN(start) ? null : start, end: isNaN(end) ? null : end };
}

export async function getStudioBookings(studioId) {
  if (!supabase || !studioId) return [];
  const { data, error } = await supabase
    .from("bookings")
    .select("id, during, status, price_eur, guest_name, guest_phone, notes, services(name), staff(name)")
    .eq("studio_id", studioId)
    .order("during", { ascending: true });
  if (error) return [];
  return (data || []).map((b) => {
    const { start, end } = parseRange(b.during);
    return {
      id: b.id,
      start, end,
      status: b.status,
      price: b.price_eur != null ? Number(b.price_eur) : null,
      client: b.guest_name || "Client",
      phone: b.guest_phone || "",
      service: (b.services && b.services.name) || "Appointment",
      staff: (b.staff && b.staff.name) || "",
      notes: b.notes || "",
    };
  });
}

export async function setBookingStatus(id, status) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

// Move a booking to a new time (RLS bookings_update = owns_studio).
export async function rescheduleBooking(id, { startISO, durationMin }) {
  if (!supabase) return { error: "supabase_not_configured" };
  const start = new Date(startISO);
  if (isNaN(start)) return { error: "bad_date" };
  const end = new Date(start.getTime() + (Number(durationMin) || 60) * 60000);
  const { error } = await supabase.from("bookings").update({ during: `[${start.toISOString()},${end.toISOString()})` }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

// Owner adds a walk-in / phone appointment (RLS bookings_owner_insert).
export async function createOwnerBooking(studioId, { name, phone, email, serviceId, staffId, startISO, durationMin, priceEur }) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!studioId || !startISO) return { error: "missing_fields" };
  const start = new Date(startISO);
  if (isNaN(start)) return { error: "bad_date" };
  const end = new Date(start.getTime() + (Number(durationMin) || 60) * 60000);
  const during = `[${start.toISOString()},${end.toISOString()})`;
  const { error } = await supabase.from("bookings").insert({
    studio_id: studioId,
    service_id: serviceId || null,
    staff_id: staffId || null,
    customer_id: null,
    during,
    status: "confirmed",
    price_eur: priceEur === "" || priceEur == null ? null : Number(priceEur),
    source: "owner",
    is_new_client: false,   // owner-added walk-ins aren't platform-acquired → no commission
    commission_due: 0,
    guest_name: name ? name.trim() : null,
    guest_phone: phone ? phone.trim() : null,
    guest_email: email ? email.trim() : null,
  });
  return error ? { error: error.message } : { ok: true };
}

// CRM: the studio's clients, aggregated from bookings, with notes.
export async function getStudioClients(studioId) {
  if (!supabase || !studioId) return [];
  const { data, error } = await supabase
    .from("bookings")
    .select("guest_name, guest_email, guest_phone, during, price_eur, status")
    .eq("studio_id", studioId);
  if (error) return [];
  const map = new Map();
  for (const b of data || []) {
    const key = (b.guest_email || b.guest_name || "").toLowerCase();
    if (!key) continue;
    const m = (b.during || "").match(/["\[]?\s*"?([^",\]]+)/);
    const start = m ? new Date(m[1]) : null;
    const cur = map.get(key) || { key, name: b.guest_name || "Client", email: b.guest_email || "", phone: b.guest_phone || "", visits: 0, spent: 0, lastVisit: null };
    if (b.status !== "cancelled") {
      cur.visits += 1;
      cur.spent += b.price_eur != null ? Number(b.price_eur) : 0;
    }
    if (b.guest_name && cur.name === "Client") cur.name = b.guest_name;
    if (b.guest_phone && !cur.phone) cur.phone = b.guest_phone;
    if (start && (!cur.lastVisit || start > cur.lastVisit)) cur.lastVisit = start;
    map.set(key, cur);
  }
  const [{ data: notes }, { data: reds }] = await Promise.all([
    supabase.from("client_notes").select("client_email, note").eq("studio_id", studioId),
    supabase.from("loyalty_redemptions").select("guest_email").eq("studio_id", studioId),
  ]);
  const noteMap = new Map((notes || []).map((n) => [(n.client_email || "").toLowerCase(), n.note || ""]));
  const redMap = new Map();
  (reds || []).forEach((r) => { const k = (r.guest_email || "").toLowerCase(); redMap.set(k, (redMap.get(k) || 0) + 1); });
  return Array.from(map.values())
    .map((c) => ({ ...c, note: noteMap.get(c.email.toLowerCase()) || "", redemptions: redMap.get(c.email.toLowerCase()) || 0 }))
    .sort((a, b) => (b.lastVisit || 0) - (a.lastVisit || 0));
}

// Email the studio's clients (retention campaign) via /api/marketing.
export async function sendMarketing(message) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { data: sess } = await supabase.auth.getSession();
  const session = sess && sess.session;
  if (!session) return { error: "auth_required" };
  try {
    const res = await fetch("/api/marketing", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ message }),
    });
    const j = await res.json().catch(() => ({}));
    return res.ok ? j : { error: j.error || "failed" };
  } catch (e) { return { error: "network_error" }; }
}

// ---- Loyalty (loyalty_programs / loyalty_redemptions) ----
export async function getLoyalty(studioId) {
  if (!supabase || !studioId) return null;
  const { data } = await supabase.from("loyalty_programs").select("stamps_required, reward, active").eq("studio_id", studioId).maybeSingle();
  return data || null;
}
export async function saveLoyalty(studioId, { stamps_required, reward, active }) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("loyalty_programs").upsert({
    studio_id: studioId,
    stamps_required: Number(stamps_required) || 6,
    reward: reward || null,
    active: !!active,
    updated_at: new Date().toISOString(),
  }, { onConflict: "studio_id" });
  return error ? { error: error.message } : { ok: true };
}
export async function redeemLoyalty(studioId, email) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!email) return { error: "no_email" };
  const { error } = await supabase.from("loyalty_redemptions").insert({ studio_id: studioId, guest_email: email.toLowerCase() });
  return error ? { error: error.message } : { ok: true };
}

// ---- Waitlist (owner side; RLS owns_studio) ----
export async function getWaitlist(studioId) {
  if (!supabase || !studioId) return [];
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, guest_name, guest_email, guest_phone, note, status, created_at, services(name)")
    .eq("studio_id", studioId).order("created_at", { ascending: false });
  if (error) return [];
  return (data || []).map((w) => ({
    id: w.id, name: w.guest_name || "Client", email: w.guest_email || "", phone: w.guest_phone || "",
    note: w.note || "", status: w.status || "waiting", service: (w.services && w.services.name) || "",
  }));
}
export async function setWaitlistStatus(id, status) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("waitlist").update({ status }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}
export async function deleteWaitlistEntry(id) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

// ---- Time off / blocked time (RLS timeoff_all = owns_studio) ----
export async function getTimeOff(studioId) {
  if (!supabase || !studioId) return [];
  const { data, error } = await supabase.from("time_off").select("id, during, reason").eq("studio_id", studioId).order("id");
  if (error) return [];
  return (data || []).map((t) => {
    const m = (t.during || "").match(/["\[]?\s*"?([^",\]]+)"?\s*,\s*"?([^",\)\]]+)"?/);
    return { id: t.id, reason: t.reason || "", start: m ? new Date(m[1]) : null, end: m ? new Date(m[2]) : null };
  }).filter((t) => t.start).sort((a, b) => a.start - b.start);
}

export async function addTimeOff(studioId, { startISO, endISO, reason }) {
  if (!supabase) return { error: "supabase_not_configured" };
  const start = new Date(startISO), end = new Date(endISO);
  if (isNaN(start) || isNaN(end) || end <= start) return { error: "bad_range" };
  const { error } = await supabase.from("time_off").insert({ studio_id: studioId, during: `[${start.toISOString()},${end.toISOString()})`, reason: reason || null });
  return error ? { error: error.message } : { ok: true };
}

export async function deleteTimeOff(id) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("time_off").delete().eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

export async function saveClientNote(studioId, email, note) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!email) return { error: "no_email" };
  const { error } = await supabase.from("client_notes")
    .upsert({ studio_id: studioId, client_email: email.toLowerCase(), note, updated_at: new Date().toISOString() }, { onConflict: "studio_id,client_email" });
  return error ? { error: error.message } : { ok: true };
}

// ---- Classes (owner side; RLS owns_studio) ----
export async function getOwnerClasses(studioId) {
  if (!supabase || !studioId) return [];
  const { data: sessions, error } = await supabase
    .from("class_sessions")
    .select("id, name, description, during, capacity, price_eur, status")
    .eq("studio_id", studioId)
    .order("during", { ascending: true });
  if (error || !sessions) return [];
  const { data: bookings } = await supabase
    .from("class_bookings")
    .select("session_id, status")
    .eq("studio_id", studioId);
  const counts = {};
  (bookings || []).forEach((b) => { if (b.status !== "cancelled") counts[b.session_id] = (counts[b.session_id] || 0) + 1; });
  return sessions.map((s) => {
    const m = (s.during || "").match(/["\[]?\s*"?([^",\]]+)"?\s*,\s*"?([^",\)\]]+)"?/);
    const start = m ? new Date(m[1]) : null;
    return {
      id: s.id, name: s.name, description: s.description || "",
      start: start && !isNaN(start) ? start : null,
      capacity: s.capacity, price: s.price_eur != null ? Number(s.price_eur) : null,
      booked: counts[s.id] || 0, status: s.status || "active",
    };
  });
}

export async function createClassSession(studioId, { name, description, startISO, durationMin, capacity, price }) {
  if (!supabase) return { error: "supabase_not_configured" };
  if (!name || !startISO) return { error: "missing_fields" };
  const start = new Date(startISO);
  if (isNaN(start)) return { error: "bad_date" };
  const end = new Date(start.getTime() + (Number(durationMin) || 60) * 60000);
  const during = `[${start.toISOString()},${end.toISOString()})`;
  const { error } = await supabase.from("class_sessions").insert({
    studio_id: studioId,
    name: name.trim(),
    description: description ? description.trim() : null,
    during,
    capacity: capacity === "" || capacity == null ? null : Number(capacity),
    price_eur: price === "" || price == null ? null : Number(price),
    status: "active",
  });
  return error ? { error: error.message } : { ok: true };
}

export async function deleteClassSession(id) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.from("class_sessions").delete().eq("id", id);
  return error ? { error: error.message } : { ok: true };
}
