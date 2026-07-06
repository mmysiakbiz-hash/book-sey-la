/* sey.la | book PWA — SELF-DESTRUCT service worker.
 *
 * The previous cache-first worker repeatedly wedged devices on a stale/broken
 * build (a blank "dead" app that a normal reload couldn't fix). Offline caching
 * is not worth that failure mode for a booking app, so we remove the SW entirely.
 *
 * This worker takes over any existing registration, deletes ALL caches,
 * unregisters itself, and reloads open pages — after which the PWA is a plain
 * network-loaded web page that is always fresh. New visitors register no SW at
 * all (the register() call was removed from index.html).
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try {
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (e) {} });
    } catch (e) {}
  })());
});

// No fetch handler on purpose — every request goes straight to the network.
