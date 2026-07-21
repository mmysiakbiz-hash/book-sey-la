"use client";
import React from "react";

// StudioMap — a plain OpenStreetMap embed (iframe). Reliable by design: it
// renders a real, pannable/zoomable map in any browser with zero JS/tile
// plumbing on our side. A single studio gets a marker at its exact spot; a
// multi-studio view fits the bounding box of every located studio.
//
// (An interactive Leaflet map with a pin per studio was attempted repeatedly
// but rendered blank in-browser and couldn't be diagnosed remotely, so we use
// the embed, which always renders.)

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
  const pad = single ? 0.006 : 0.02;
  const bbox = `${Math.min(...lngs) - pad},${Math.min(...lats) - pad},${Math.max(...lngs) + pad},${Math.max(...lats) + pad}`;
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
