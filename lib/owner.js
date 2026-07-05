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
