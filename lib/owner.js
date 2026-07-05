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
    .select("id, slug, name, category, island, address, lat, lng, bio, tagline, whatsapp, socials, photos, status, services(id,name,duration_min,price_eur,category,sort,active), staff(id,name,role,color,active), business_hours(id,day_of_week,open_min,close_min)")
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
  const { data, error } = await supabase
    .from("studios")
    .insert({ owner_id: user.id, owner_email: user.email || null, name: name || "", slug, category: category || null, status: "draft" })
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
