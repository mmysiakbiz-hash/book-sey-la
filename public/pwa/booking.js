/* sey.la | book PWA — auth + real booking bridge.
   Exposes window.SEY_BOOK. Uses the self-hosted supabase-js UMD (vendor/supabase.js)
   with the DEFAULT storage key, so a session created on the marketing site
   (/login, same origin) is shared into the PWA automatically — and vice-versa.

   createBooking() posts to /api/book (server-side insert under the user's RLS
   identity + Brevo confirmation email), exactly like lib/bookings.js on the web.

   Everything is best-effort and guarded: if supabase-js failed to load, or the
   user has no session, the caller falls back to the local (demo) booking so the
   UI never breaks. */
(function () {
  var SUPABASE_URL = "https://eoapvjnaievxqkbmtxar.supabase.co";
  var SUPABASE_ANON = "sb_publishable_tZhLyNftU_iSMfZnu5NyOQ_Ht2h2GN6";

  var client = null;
  try {
    if (window.supabase && window.supabase.createClient) {
      // Default storage/storageKey → shares the session with the Next.js site.
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    }
  } catch (e) { client = null; }

  function available() { return !!client; }

  async function getUser() {
    if (!client) return null;
    try {
      var res = await client.auth.getUser();
      return (res && res.data && res.data.user) || null;
    } catch (e) { return null; }
  }

  async function getSession() {
    if (!client) return null;
    try {
      var res = await client.auth.getSession();
      return (res && res.data && res.data.session) || null;
    } catch (e) { return null; }
  }

  // Email magic link. redirectTo must be allow-listed in Supabase Auth → URL Config.
  // Primary path: /api/auth/magic-link (server generates link + sends via Brevo).
  // Falls back to Supabase's own signInWithOtp if that route isn't configured (503).
  async function sendMagicLink(email) {
    if (!email) return { error: "missing_email" };
    var redirectTo = window.location.origin + "/pwa/";
    try {
      var res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email, redirectTo: redirectTo }),
      });
      var json = await res.json().catch(function () { return {}; });
      if (res.ok && json.ok) return { ok: true };
      if (res.status !== 503) return { error: json.error || ("http_" + res.status) };
    } catch (e) { /* fall through to Supabase */ }

    if (!client) return { error: "supabase_unavailable" };
    try {
      var r = await client.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo } });
      return r.error ? { error: r.error.message } : { ok: true };
    } catch (e) { return { error: "network_error" }; }
  }

  async function signOut() {
    if (client) { try { await client.auth.signOut({ scope: "global" }); } catch (e) {} }
  }

  // Notify listeners when auth state changes (magic-link return, sign-out).
  // cb(user, event) — event lets callers ignore the initial null session so a
  // persisted/demo user is never clobbered on load.
  function onAuthChange(cb) {
    if (!client || typeof cb !== "function") return function () {};
    try {
      var sub = client.auth.onAuthStateChange(function (event, session) {
        cb((session && session.user) || null, event);
      });
      return function () { try { sub.data.subscription.unsubscribe(); } catch (e) {} };
    } catch (e) { return function () {}; }
  }

  /* Create a real booking. Needs a live session (RLS: customer_id = auth.uid()).
     p: { studioDbId, serviceDbId?, staffId?, startsAt (ISO|Date), durationMin?, priceEur?, notes? }
     Returns { data, emailed } on success, or { error } (caller falls back to local). */
  async function createBooking(p) {
    if (!client) return { error: "supabase_unavailable" };
    if (!p || !p.studioDbId || !p.startsAt) return { error: "missing_studio_or_time" };

    var session = await getSession();
    if (!session) return { error: "auth_required" };

    try {
      var res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({
          studioId: p.studioDbId,
          serviceId: p.serviceDbId || null,
          staffId: p.staffId || null,
          startsAt: typeof p.startsAt === "string" ? p.startsAt : new Date(p.startsAt).toISOString(),
          durationMin: p.durationMin || 60,
          priceEur: p.priceEur != null ? p.priceEur : null,
          notes: p.notes || null,
          phone: p.phone || null,
        }),
      });
      var json = await res.json().catch(function () { return { error: "http_" + res.status }; });
      if (!res.ok || json.error) return { error: json.error || ("http_" + res.status) };
      return { data: json.booking, emailed: json.emailed };
    } catch (e) {
      return { error: "network_error" };
    }
  }

  window.SEY_BOOK = {
    available: available,
    getUser: getUser,
    getSession: getSession,
    sendMagicLink: sendMagicLink,
    signOut: signOut,
    onAuthChange: onAuthChange,
    createBooking: createBooking,
  };
})();
