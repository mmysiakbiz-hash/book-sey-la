"use client";
import React from "react";

// StudioMap — a plain OpenStreetMap embed (iframe). Deliberately NOT Leaflet:
// the Leaflet approach (CDN, then bundled, then self-hosted) kept coming up
// blank in the browser and couldn't be debugged from the server. OSM's own
// hosted embed renders a real, pannable/zoomable map in any browser with zero
// JS/tile plumbing on our side — reliable by design.
//
// A single studio gets a marker at its exact spot; a multi-studio view fits the
// bounding box of every located studio (the list below shows which is which).

export function StudioMap({ studios = [] }) {
  const pins = (studios || []).filter((s) => typeof s.lat === "number" && typeof s.lng === "number");

  if (!pins.length) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "var(--blush, #f6ece9)", color: "var(--cocoa-60)", fontSize: "var(--text-sm)", textAlign: "center", padding: 20 }}>
        Studios appear here once their location is set.
      </div>
    );
  }

  const lats = pins.map((p) => p.lat);
  const lngs = pins.map((p) => p.lng);
  const single = pins.length === 1;
  const pad = single ? 0.006 : 0.02; // ~street level for one, a little air for many
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  const marker = single ? `&marker=${pins[0].lat},${pins[0].lng}` : "";
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;

  return (
    <iframe
      title="Map"
      src={src}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
