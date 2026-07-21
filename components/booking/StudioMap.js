"use client";
import React from "react";

// StudioMap — Airbnb-style interactive map: a price pin per studio, click to
// open it. Leaflet is loaded once in the app <head> (so window.L is reliably
// present); we just use it here. If Leaflet somehow isn't available, we fall
// back to a plain OpenStreetMap embed iframe so a map ALWAYS renders.

const SEYCHELLES = [-4.62, 55.45]; // Mahé area
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// The studio's "from" price for the pin label (lowest service price), e.g. "SCR 22".
function priceLabel(s) {
  let min = null;
  for (const sv of s.services || []) {
    const n = parseInt(String(sv.price != null ? sv.price : sv.priceEur != null ? sv.priceEur : "").replace(/[^\d]/g, ""), 10);
    if (!isNaN(n) && (min === null || n < min)) min = n;
  }
  return min != null ? `SCR ${min}` : null;
}

// Resolve with window.L (loaded in <head>); reject after ~4s so we can fall back.
function waitForL() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.L) return resolve(window.L);
    let waited = 0;
    const iv = setInterval(() => {
      if (window.L) { clearInterval(iv); resolve(window.L); }
      else if ((waited += 100) >= 4000) { clearInterval(iv); reject(new Error("leaflet unavailable")); }
    }, 100);
  });
}

// Plain OSM embed — the guaranteed fallback (renders in any browser, no JS map).
function IframeMap({ pins }) {
  const lats = pins.map((p) => p.lat), lngs = pins.map((p) => p.lng);
  const single = pins.length === 1;
  const pad = single ? 0.006 : 0.02;
  const bbox = `${Math.min(...lngs) - pad},${Math.min(...lats) - pad},${Math.max(...lngs) + pad},${Math.max(...lats) + pad}`;
  const marker = single ? `&marker=${pins[0].lat},${pins[0].lng}` : "";
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;
  return <iframe title="Map" src={src} style={{ width: "100%", height: "100%", border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
}

export function StudioMap({ studios = [] }) {
  const elRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [useIframe, setUseIframe] = React.useState(false);
  const pins = (studios || []).filter((s) => typeof s.lat === "number" && typeof s.lng === "number");

  React.useEffect(() => {
    if (!pins.length) return;
    let cancelled = false;
    waitForL()
      .then((L) => {
        if (cancelled || !elRef.current) return;
        if (!mapRef.current) {
          mapRef.current = L.map(elRef.current, { scrollWheelZoom: false }).setView(SEYCHELLES, 11);
          L.tileLayer(OSM_TILES, { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(mapRef.current);
        }
        const map = mapRef.current;
        (map._seyPins || []).forEach((m) => map.removeLayer(m));
        map._seyPins = [];
        const coords = [];
        pins.forEach((s) => {
          const label = priceLabel(s) || s.name || "View";
          const icon = L.divIcon({ className: "sey-price-pin", html: `<span>${esc(label)}</span>`, iconSize: null });
          const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
          const href = s.href || (s.slug ? `/studio/${s.slug}` : "");
          m.bindPopup(`<b>${esc(s.name)}</b>${s.location ? `<br>${esc(s.location)}` : ""}${href ? `<br><a href="${href}">View studio →</a>` : ""}`);
          map._seyPins.push(m);
          coords.push([s.lat, s.lng]);
        });
        if (coords.length === 1) map.setView(coords[0], 14);
        else if (coords.length > 1) map.fitBounds(coords, { padding: [40, 40], maxZoom: 14 });
        setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 80);
      })
      .catch(() => { if (!cancelled) setUseIframe(true); });
    return () => { cancelled = true; };
  }, [studios]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => () => { if (mapRef.current) { try { mapRef.current.remove(); } catch (e) {} mapRef.current = null; } }, []);

  if (!pins.length) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "var(--blush, #f6ece9)", color: "var(--cocoa-60)", fontSize: "var(--text-sm)", textAlign: "center", padding: 20 }}>
        Studios appear here once their location is set.
      </div>
    );
  }
  if (useIframe) return <IframeMap pins={pins} />;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={elRef} style={{ width: "100%", height: "100%" }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-marker-icon.sey-price-pin { width: auto !important; height: auto !important; background: none; border: none; }
        .sey-price-pin span { display: inline-block; transform: translate(-50%, -120%); background: #fff; color: var(--cocoa, #3b2a25); font-family: var(--font-body); font-weight: 700; font-size: 13px; line-height: 1; padding: 6px 11px; border-radius: 999px; box-shadow: 0 2px 8px rgba(0,0,0,.28); white-space: nowrap; border: 1px solid rgba(0,0,0,.08); }
        .leaflet-popup-content { font-family: var(--font-body); }
        .leaflet-popup-content a { color: var(--clay, #c2603f); font-weight: 600; text-decoration: none; }
      ` }} />
    </div>
  );
}
