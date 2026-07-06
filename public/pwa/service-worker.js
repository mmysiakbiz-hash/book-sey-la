/* sey.la | book PWA — service worker. Precache the self-hosted shell for offline.
 *
 * Strategy:
 *  - App shell (HTML navigations + the app's own .js) = NETWORK-FIRST, cache
 *    fallback. This guarantees a new deploy always reaches the user; a broken or
 *    stale build can never wedge the app in cache (the old cache-first behaviour
 *    on App.js is exactly what made a bad build look "dead" until a version bump).
 *  - Everything else (vendor libs, CSS, tokens, icons, remote images) =
 *    CACHE-FIRST for speed/offline — these change only with a version bump.
 */
const CACHE = "seyla-book-v10";
const ASSETS = [
  "./index.html",
  "./app.css",
  "./App.js",
  "./live.js",
  "./booking.js",
  "./ui.js",
  "./data.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./styles.css",
  "./tokens/colors.css",
  "./tokens/typography.css",
  "./tokens/spacing.css",
  "./tokens/effects.css",
  "./tokens/base.css",
  "./tokens/fonts.css",
  "./_ds_bundle.js",
  "./vendor/react.production.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/supabase.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  let url;
  try { url = new URL(request.url); } catch (err) { return; }

  // Never intercept/cache Supabase API or auth calls — caching them would serve
  // a stale session/user or stale studio data. Let them hit the network directly.
  if (url.hostname.endsWith(".supabase.co")) return;

  const sameOrigin = url.origin === self.location.origin;
  // The app shell = page navigations + our own JS (App.js, live.js, booking.js,
  // data.js, ui.js, _ds_bundle.js). These must stay fresh.
  const isShell = request.mode === "navigate" || (sameOrigin && url.pathname.endsWith(".js"));

  if (isShell) {
    // Network-first: fetch the latest, update cache, fall back to cache offline.
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for static assets (CSS, tokens, vendor, icons) + remote images.
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached);
    })
  );
});
