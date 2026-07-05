"use client";
import React from "react";
// PhotoStrip — full-bleed band of warm-treated photos, interleaved between sections.


const U = "https://images.unsplash.com/photo-";
const DEFAULT = [
  { src: U + "1512864084360-7c0c4d0a0845", alt: "Barber lining up a fresh cut" },
  { src: U + "1519699047748-de8e457a634e", alt: "Client after a hair appointment" },
  { src: U + "1544161515-4ab6ce6db874", alt: "Massage at a spa" },
  { src: U + "1699641975121-5c3f55a553e5", alt: "Man getting a haircut" },
  { src: U + "1632765854612-9b02b6ec2b15", alt: "Client at a beauty studio" },
];

function PhotoStrip({ caption, photos = DEFAULT }) {
  return (
    <section className="lp-photostrip" aria-label={caption || "Studios on the islands"}>
      {caption && <div className="lp-photostrip-caption sey-eyebrow">{caption}</div>}
      <div className="lp-photostrip-row">
        {photos.map((p, i) => (
          <figure className="lp-photostrip-cell" key={i}>
            <img src={p.src + "?auto=format&fit=crop&w=600&q=70"} alt={p.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}

export default PhotoStrip;
