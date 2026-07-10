"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/booking/SearchBar";
import { BookingCard } from "@/components/booking/BookingCard";
import { Icon } from "@/components/brand/Icon";
// Hero — marketplace search-first hero (Fresha/Booksy style) with a warm photo montage.



// Popular treatment types → the real category the search filters on.
const POPULAR = [
  { label: "Massage", cat: "Spa & massage" },
  { label: "Hair", cat: "Hair" },
  { label: "Nails", cat: "Nails" },
  { label: "Barber", cat: "Barber" },
  { label: "Facial", cat: "Skin & facial" },
  { label: "Yoga", cat: "Fitness & yoga" },
];
const ISLANDS = ["Mahé", "Praslin", "La Digue"];
const U = "https://images.unsplash.com/photo-";

function Hero() {
  const router = useRouter();
  const goSearch = ({ q, loc }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (loc) p.set("loc", loc);
    const qs = p.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };
  return (
    <section className="lp-hero">
      <div className="sey-container lp-hero-grid">
        <div className="lp-hero-copy lp-fade">
          <div className="sey-eyebrow lp-hero-eyebrow">Mahé · Praslin · La Digue</div>
          <h1 className="lp-hero-title">
            Book beauty &amp; wellness across the Seychelles.
          </h1>
          <p className="lp-hero-lead">
            Search verified local studios, see real-time availability, and book in
            seconds — always free for you.
          </p>
          <div className="lp-hero-search">
            <SearchBar cta="Search" onSubmit={goSearch} />
          </div>
          <div className="lp-hero-popular">
            <span className="lp-hero-popular-label">Popular</span>
            {POPULAR.map((p) => (
              <a key={p.label} href={`/search?cat=${encodeURIComponent(p.cat)}`} className="lp-chip">{p.label}</a>
            ))}
          </div>
          <div className="lp-hero-popular">
            <span className="lp-hero-popular-label">Islands</span>
            {ISLANDS.map((i) => (
              <a key={i} href={`/search?loc=${encodeURIComponent(i)}`} className="lp-chip">{i}</a>
            ))}
          </div>
          <div className="lp-hero-trust">
            <span className="lp-hero-rating">
              <Icon name="clock" size={16} color="var(--ink)" />
              Real-time availability
            </span>
            <span className="lp-hero-free"><Icon name="heart" size={15} color="var(--cocoa-60)" /> Free for clients</span>
          </div>
        </div>

        <div className="lp-hero-montage lp-fade lp-fade--2" aria-hidden="true">
          <img className="lp-m lp-m--a" src={U + "1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=70"} alt="" loading="lazy" />
          <img className="lp-m lp-m--b" src={U + "1512864084360-7c0c4d0a0845?auto=format&fit=crop&w=440&q=70"} alt="" loading="lazy" />
          <img className="lp-m lp-m--c" src={U + "1632765854612-9b02b6ec2b15?auto=format&fit=crop&w=440&q=70"} alt="" loading="lazy" />
          <img className="lp-m lp-m--d" src={U + "1699641975121-5c3f55a553e5?auto=format&fit=crop&w=440&q=70"} alt="" loading="lazy" />
          <div className="lp-hero-floatcard">
            <BookingCard service="Coconut & Frangipani massage" studio="Kreol Spa · Beau Vallon" when="Tomorrow · 14:30" price="SCR 55" status="Confirmed" float style={{ maxWidth: "none" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
