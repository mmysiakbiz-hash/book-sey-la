// Supabase Auth — email magic link.
import { supabase } from "./supabaseClient";

// Send a magic-link email. `redirectTo` must be listed in Supabase Auth
// → URL Configuration → Redirect URLs.
//
// Primary path: our /api/auth/magic-link server route generates the link and
// emails it via Brevo (reliable, no dependency on Supabase SMTP). If the server
// isn't configured for that (no SUPABASE_SERVICE_ROLE_KEY, returns 503), fall
// back to Supabase's built-in signInWithOtp so nothing breaks.
export async function sendMagicLink(email, redirectTo) {
  try {
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, redirectTo }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) return { ok: true };
    if (res.status !== 503) return { error: json.error || `http_${res.status}` };
  } catch (e) {
    // network error → try the Supabase fallback below
  }

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
  // Global scope invalidates the session on every device, not just this tab.
  if (supabase) await supabase.auth.signOut({ scope: "global" });
}

export async function updateMyName(name) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { error } = await supabase.auth.updateUser({ data: { name: (name || "").trim() } });
  return error ? { error: error.message } : { ok: true };
}
