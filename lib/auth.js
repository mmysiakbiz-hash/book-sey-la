// Supabase Auth — email magic link.
import { supabase } from "./supabaseClient";

// Send a magic-link email. `redirectTo` must be listed in Supabase Auth
// → URL Configuration → Redirect URLs.
export async function sendMagicLink(email, redirectTo) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return error ? { error: error.message } : { ok: true };
}

export async function getSessionUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return (data && data.user) || null;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
