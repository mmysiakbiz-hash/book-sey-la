"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { SaveStudioButton } from "@/components/booking/SaveStudioButton";
// VenueHero — the studio's own header + full-bleed cover hero.


const U = "https://images.unsplash.com/photo-";

function VenueHero({ studio }) {
  // Live studio from Supabase when available; demo (Kreol Spa) fallback otherwise.
  const name = (studio && studio.name) || "Kreol Spa";
  const parts = name.trim().split(" ");
  const mark = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;
  const word = parts.length > 1 ? parts[parts.length - 1] : "";
  const category = (studio && studio.category) || "Spa & massage";
  const location = (studio && studio.location) || "Beau Vallon, Mahé";
  const shortLoc = location.split(",")[0];
  const lead =
    (studio && studio.tagline) ||
    "A quiet island ritual a few steps from the sand — warm oils, frangipani, and slow hands. Book a table in seconds.";
  const raw = (studio && studio.image) || U + "1696841212541-449ca29397cc";
  const cover = raw.includes("?") ? raw : raw + "?auto=format&fit=crop&w=1600&q=75";
  const rating = studio && studio.rating != null ? studio.rating : 4.9;
  const reviewCount = studio && studio.reviewCount != null ? studio.reviewCount : 214;
  // Only surface review UI when the studio actually has published reviews.
  const hasReviews = !!(studio && Array.isArray(studio.reviews) && studio.reviews.some((r) => r && (r.text || r.comment || r.review)));

  return (
    <React.Fragment>
      <header className="vn-topbar">
        <div className="sey-container vn-topbar-inner">
          <a className="vn-brand" href="#top">
            <span className="vn-brand-mark">{mark}</span>
            {word && <span className="vn-brand-word">{word}</span>}
          </a>
          <nav className="vn-nav" aria-label="Sections">
            <a href="#services">Services</a>
            <a href="#classes">Classes</a>
            <a href="#team">Team</a>
            <a href="#gallery">Gallery</a>
            {hasReviews && <a href="#reviews">Reviews</a>}
            <a href="#visit">Visit</a>
          </nav>
          <div className="vn-topbar-cta">
            <a className="vn-call" href="#visit"><Icon name="pin" size={16} color="var(--clay)" /> {shortLoc}</a>
            {studio && studio.id && <SaveStudioButton studioId={studio.id} />}
            <Button size="sm" href="#services" as="a">Book now</Button>
          </div>
        </div>
      </header>

      <section className="vn-hero" id="top">
        <div className="vn-hero-media" aria-hidden="true">
          <img src={cover} alt="" />
          <div className="vn-hero-scrim"></div>
        </div>
        <div className="sey-container vn-hero-inner">
          <div className="vn-hero-eyebrow">{category} · {location}</div>
          <h1 className="vn-hero-title">{mark} {word && <em className="sey-accent-italic">{word}</em>}</h1>
          <p className="vn-hero-lead">{lead}</p>
          <div className="vn-hero-meta">
            {hasReviews && <span className="vn-meta-pill"><Icon name="star" size={15} color="var(--brass)" /> <b>{rating}</b> · {reviewCount} reviews</span>}
            <span className="vn-meta-pill vn-open"><span className="vn-dot"></span> Open until 19:00</span>
            <span className="vn-meta-pill"><Icon name="heart" size={14} color="var(--clay)" /> Free to book</span>
          </div>
          <div className="vn-hero-actions">
            <Button size="lg" href="#services" as="a">Book a treatment</Button>
            <Button size="lg" variant="secondary" href="#visit" as="a">Get directions</Button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default VenueHero;
