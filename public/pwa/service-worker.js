/* sey.la | book PWA — service worker. Precache the self-hosted shell for offline. */
const CACHE = "seyla-book-v9";
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

// Cache-first for precached shell; network-first with cache fallback for the rest (e.g. Unsplash).
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  // Never intercept/cache Supabase API or auth calls — caching them would serve
  // a stale session/user or stale studio data. Let them hit the network directly.
  let host = "";
  try { host = new URL(request.url).hostname; } catch (err) {}
  if (host.endsWith(".supabase.co")) return;
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
