// Favourites — a signed-in customer saving studios. RLS (fav_self) binds every
// row to user_id = auth.uid(), so all of this runs safely on the client session.
import { supabase } from "./supabaseClient";

async function uid() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return (data && data.user && data.user.id) || null;
}

export async function getFavouriteIds() {
  if (!supabase) return [];
  if (!(await uid())) return [];
  const { data, error } = await supabase.from("favourites").select("studio_id");
  if (error) return [];
  return (data || []).map((r) => r.studio_id);
}

export async function getFavouriteStudios() {
  if (!supabase) return [];
  if (!(await uid())) return [];
  const { data, error } = await supabase
    .from("favourites")
    .select("studio_id, created_at, studios(slug,name,category,address,island,photos,status,billing_blocked)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data || [])
    .filter((r) => r.studios) // suspended/removed studios embed as null
    .map((r) => ({
      studioId: r.studio_id,
      slug: r.studios.slug,
      name: r.studios.name,
      category: r.studios.category,
      location: r.studios.address || r.studios.island || "",
      photo: Array.isArray(r.studios.photos) ? r.studios.photos[0] : null,
    }));
}

// Returns { saved } (new state) or { error }.
export async function toggleFavourite(studioId) {
  if (!supabase) return { error: "supabase_not_configured" };
  const id = await uid();
  if (!id) return { error: "auth_required" };
  if (!studioId) return { error: "missing_studio" };

  const { data: existing } = await supabase
    .from("favourites").select("studio_id").eq("studio_id", studioId).maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favourites").delete().eq("studio_id", studioId).eq("user_id", id);
    return error ? { error: error.message } : { saved: false };
  }
  const { error } = await supabase.from("favourites").insert({ user_id: id, studio_id: studioId });
  return error ? { error: error.message } : { saved: true };
}
