"use client";
import React from "react";

// StudioMap — a real OpenStreetMap (Leaflet) with a pin per studio that has
// coordinates. Leaflet is SELF-HOSTED (served from /vendor/leaflet, same-origin)
// and loaded as a plain <script> exposing window.L — the exact approach the PWA
// uses. No third-party CDN (unpkg) and no bundler/dynamic-import quirks, both of
// which had left the map blank. Studios without coordinates just don't get a pin.

const SEYCHELLES = [-4.62, 55.45]; // Mahé area
// OSM's current recommended single-host tile endpoint (HTTP/2, no a/b/c subdomains).
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const LEAFLET_CSS = "/vendor/leaflet/leaflet.css";
const LEAFLET_JS = "/vendor/leaflet/leaflet.js";

// Inject Leaflet's CSS + JS from our own domain and resolve with window.L.
// Polls for window.L (handles an already-loaded/cached script that won't re-fire
// its load event) and hard-times-out so the map can never hang silently blank —
// on timeout it rejects, which shows the visible "Map couldn't load" fallback.
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.L) return resolve(window.L);
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.setAttribute("data-leaflet", "1");
      document.head.appendChild(link);
    }
    let s = document.querySelector("script[data-leaflet]");
    if (!s) {
      s = document.createElement("script");
      s.src = LEAFLET_JS;
      s.setAttribute("data-leaflet", "1");
      document.body.appendChild(s);
    }
    const ready = () => (window.L ? (resolve(window.L), true) : false);
    s.addEventListener("load", () => { if (!ready()) reject(new Error("leaflet loaded but window.L missing")); });
    s.addEventListener("error", () => reject(new Error("leaflet failed to load")));
    // Backstop for a cached script (load already fired) or a stalled network.
    let waited = 0;
    const iv = setInterval(() => {
      if (ready()) clearInterval(iv);
      else if ((waited += 200) >= 8000) { clearInterval(iv); reject(new Error("leaflet timeout")); }
    }, 200);
  });
}

const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function StudioMap({ studios = [] }) {
  const elRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [failed, setFailed] = React.useState(false);
  const pins = (studios || []).filter((s) => typeof s.lat === "number" && typeof s.lng === "number");

  React.useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !elRef.current) return;
        if (!mapRef.current) {
          mapRef.current = L.map(elRef.current, { scrollWheelZoom: false }).setView(SEYCHELLES, 10);
          L.tileLayer(OSM_TILES, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(mapRef.current);
        }
        const map = mapRef.current;
        (map._seyMarkers || []).forEach((m) => map.removeLayer(m));
        map._seyMarkers = [];
        const icon = L.divIcon({ className: "sey-map-marker", html: "<span></span>", iconSize: [22, 22], iconAnchor: [11, 20] });
        const coords = [];
        pins.forEach((s) => {
          const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
          const href = s.href || (s.slug ? `/studio/${s.slug}` : "");
          m.bindPopup(`<b>${esc(s.name)}</b>${s.location ? `<br>${esc(s.location)}` : ""}${href ? `<br><a href="${href}">View studio →</a>` : ""}`);
          map._seyMarkers.push(m);
          coords.push([s.lat, s.lng]);
        });
        if (coords.length === 1) map.setView(coords[0], 14);
        else if (coords.length > 1) map.fitBounds(coords, { padding: [30, 30], maxZoom: 14 });
        setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 60);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [studios]);

  React.useEffect(() => () => { if (mapRef.current) { try { mapRef.current.remove(); } catch (e) {} mapRef.current = null; } }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={elRef} style={{ width: "100%", height: "100%" }} />
      {failed && (
        // A visible fallback beats a silent blank — and lets QA spot a broken map.
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "var(--blush, #f6ece9)", color: "var(--cocoa-60)", fontSize: "var(--text-sm)", padding: 20 }}>
          Map couldn't load right now — the studios are still listed below.
        </div>
      )}
      {!failed && pins.length === 0 && (
        <div style={{ position: "absolute", left: 12, bottom: 12, right: 12, background: "rgba(252,248,242,0.94)", color: "var(--cocoa-60)", fontSize: "var(--text-xs)", padding: "8px 12px", borderRadius: "var(--radius-pill)", textAlign: "center" }}>
          Studios appear here once their location is set.
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .sey-map-marker span { display:block; width:22px; height:22px; border-radius:50% 50% 50% 0; background:var(--clay); transform:rotate(-45deg); border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.3); }
        .leaflet-popup-content a { color: var(--clay); font-weight:600; text-decoration:none; }
      ` }} />
    </div>
  );
}
