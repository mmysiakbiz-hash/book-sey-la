"use client";
import React from "react";
import { StudioCard } from "@/components/booking/StudioCard";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Button } from "@/components/core/Button";
// FeaturedStudios — marketplace "recommended" grid of venues (Fresha/Booksy style).



const U = "https://images.unsplash.com/photo-";
// Design-showcase placeholders shown ONLY when there are no real studios yet.
// Clearly badged "Demo" and NOT bookable — the card links to /for-studios
// ("this could be your studio") so nobody hits a dead booking.
const DEMO = [
  { name: "Kreol Spa", location: "Beau Vallon, Mahé", category: "Spa & massage", image: U + "1519823551278-64ac92734fb1", rating: 4.9, reviews: 214, badge: "Demo", href: "/for-studios",
    services: [{ name: "Coconut & Frangipani massage", duration: "60 min", price: "SCR 55" }, { name: "Aroma back & neck", duration: "30 min", price: "SCR 30" }] },
  { name: "Palm & Blade", location: "Victoria, Mahé", category: "Barber", image: U + "1512864084360-7c0c4d0a0845", rating: 4.8, reviews: 132, badge: "Demo", href: "/for-studios",
    services: [{ name: "Skin fade & style", duration: "40 min", price: "SCR 22" }, { name: "Beard trim & hot towel", duration: "25 min", price: "SCR 16" }] },
  { name: "Lumière Studio", location: "Victoria, Mahé", category: "Hair", image: U + "1632765866070-3fadf25d3d5b", rating: 4.8, reviews: 176, badge: "Demo", href: "/for-studios",
    services: [{ name: "Cut & blow-dry", duration: "45 min", price: "SCR 30" }, { name: "Braids & styling", duration: "120 min", price: "SCR 60" }] },
];

function FeaturedStudios({ studios }) {
  // Real studios from Supabase when available; otherwise the 3 badged demos.
  // (rev2 — force recompile)
  const hasReal = !!(studios && studios.length);
  const list = hasReal ? studios.slice(0, 8) : DEMO;
  return (
    <section className="lp-section" id="studios-featured">
      <div className="sey-container">
        <div className="lp-featured-head">
          <SectionHeader
            eyebrow="Recommended near you"
            title="Top-rated island"
            accent="studios."
            intro={hasReal
              ? "Verified salons and spas booking through sey.la right now, sorted by what locals and travellers love."
              : "A preview of how studios look on sey.la. These are demos — real salons appear here as they join."}
          />
          <Button variant="secondary" className="lp-featured-cta" as="a" href={hasReal ? "/search" : "/for-studios"}>{hasReal ? "See all studios" : "List your studio"}</Button>
        </div>
        <div className="lp-featured">
          {list.map((s) => (
            <StudioCard key={s.slug || s.name} {...s} as="a" href={s.href || (s.slug ? `/studio/${s.slug}` : "/search")} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedStudios;
