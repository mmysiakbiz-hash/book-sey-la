// Referrals — the customer can read their own invites (RLS referrals_self by
// email); creating one goes through /api/refer (no client INSERT policy).
import { supabase } from "./supabaseClient";

export async function getMyReferrals() {
  if (!supabase) return [];
  const { data: auth } = await supabase.auth.getUser();
  if (!auth || !auth.user) return [];
  const { data, error } = await supabase
    .from("referrals")
    .select("id, referred_email, status, credit_eur, created_at")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function createReferral(email) {
  if (!supabase) return { error: "supabase_not_configured" };
  const { data: sess } = await supabase.auth.getSession();
  const session = sess && sess.session;
  if (!session) return { error: "auth_required" };
  try {
    const res = await fetch("/api/refer", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ email }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) return { ok: true };
    return { error: json.error || `http_${res.status}` };
  } catch (e) {
    return { error: "network_error" };
  }
}
