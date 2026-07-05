"use client";
import React from "react";
import { StudioCard } from "@/components/booking/StudioCard";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Button } from "@/components/core/Button";
// FeaturedStudios — marketplace "recommended" grid of venues (Fresha/Booksy style).



const U = "https://images.unsplash.com/photo-";
const STUDIOS = [
  { name: "Kreol Spa", location: "Beau Vallon, Mahé", category: "Spa & massage", image: U + "1519823551278-64ac92734fb1", rating: 4.9, reviews: 214, badge: "Popular",
    services: [{ name: "Coconut & Frangipani massage", duration: "60 min", price: "€55" }, { name: "Aroma back & neck", duration: "30 min", price: "€30" }] },
  { name: "Palm & Blade", location: "Victoria, Mahé", category: "Barber", image: U + "1512864084360-7c0c4d0a0845", rating: 4.8, reviews: 132, badge: "Loved by locals",
    services: [{ name: "Skin fade & style", duration: "40 min", price: "€22" }, { name: "Beard trim & hot towel", duration: "25 min", price: "€16" }] },
  { name: "Lumière Studio", location: "Victoria, Mahé", category: "Hair", image: U + "1632765866070-3fadf25d3d5b", rating: 4.8, reviews: 176,
    services: [{ name: "Cut & blow-dry", duration: "45 min", price: "€30" }, { name: "Braids & styling", duration: "120 min", price: "€60" }] },
  { name: "Frangipani Nails", location: "Grand Anse, Praslin", category: "Nails", image: U + "1632345031435-8727f6897d53", rating: 4.9, reviews: 98,
    services: [{ name: "Gel manicure", duration: "45 min", price: "€25" }, { name: "Spa pedicure", duration: "60 min", price: "€35" }] },
  { name: "Island Glow", location: "La Digue", category: "Brows & lashes", image: U + "1632765854612-9b02b6ec2b15", rating: 4.7, reviews: 64, badge: "New",
    services: [{ name: "Signature facial", duration: "50 min", price: "€48" }, { name: "Brow lamination", duration: "40 min", price: "€35" }] },
  { name: "North Shore Grooming", location: "Beau Vallon, Mahé", category: "Barber & grooming", image: U + "1699641975121-5c3f55a553e5", rating: 4.9, reviews: 121,
    services: [{ name: "Cut, beard & hot towel", duration: "45 min", price: "€26" }, { name: "Deep-tissue back & neck", duration: "30 min", price: "€32" }] },
  { name: "Zen Shore", location: "Anse Royale, Mahé", category: "Spa", image: U + "1696841212541-449ca29397cc", rating: 5.0, reviews: 87,
    services: [{ name: "Hot stone therapy", duration: "75 min", price: "€65" }, { name: "Scalp ritual", duration: "30 min", price: "€30" }] },
  { name: "Takamaka Wellness", location: "Takamaka, Mahé", category: "Spa & massage", image: U + "1570172619644-dfd03ed5d881", rating: 4.8, reviews: 73,
    services: [{ name: "Volcanic clay facial", duration: "50 min", price: "€44" }, { name: "Sports recovery massage", duration: "60 min", price: "€58" }] },
];

function FeaturedStudios({ studios }) {
  // Live studios from Supabase when available; demo fallback otherwise.
  const list = studios && studios.length ? studios.slice(0, 8) : STUDIOS;
  return (
    <section className="lp-section" id="studios-featured">
      <div className="sey-container">
        <div className="lp-featured-head">
          <SectionHeader
            eyebrow="Recommended near you"
            title="Top-rated island"
            accent="studios."
            intro="Verified salons and spas booking through sey.la right now, sorted by what locals and travellers love."
          />
          <Button variant="secondary" className="lp-featured-cta" as="a" href="/search">See all studios</Button>
        </div>
        <div className="lp-featured">
          {list.map((s) => (
            <StudioCard key={s.slug || s.name} {...s} as="a" href={s.href || "/search"} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedStudios;
