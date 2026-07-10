"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
// VenueClose — reviews, visit info (hours + map), booking CTA, powered-by footer.


const HOURS = [
  ["Mon – Fri", "9:00 – 19:00"],
  ["Saturday", "9:00 – 17:00"],
  ["Sunday", "10:00 – 15:00"],
];

const avatar = (u) =>
  u && u.includes("images.unsplash") && !u.includes("?")
    ? u + "?auto=format&fit=crop&w=100&h=100&q=70"
    : u;

function VenueClose({ studio }) {
  const name = (studio && studio.name) || "Kreol Spa";
  const parts = name.trim().split(" ");
  const mark = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;
  const word = parts.length > 1 ? parts[parts.length - 1] : "";
  const location = (studio && studio.location) || "Beau Vallon, Mahé";
  const rating = studio && studio.rating != null ? studio.rating : 4.9;
  const reviewCount = studio && studio.reviewCount != null ? studio.reviewCount : 214;

  // Live Google reviews (defensive shape). No demo fallback: when a studio has
  // no published reviews we hide the whole section rather than show fake ones.
  const reviews = (studio && Array.isArray(studio.reviews) ? studio.reviews : [])
    .map((r) => ({
      name: r.author_name || r.author || r.name || "Guest",
      when: r.relative_time_description || r.when || r.time || "",
      text: r.text || r.comment || r.review || "",
      img: r.profile_photo_url || r.img || r.avatar || "",
      rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))),
    }))
    .filter((r) => r.text);
  const hasReviews = reviews.length > 0;

  // Real opening hours when configured, otherwise the tasteful default.
  const hours = (studio && Array.isArray(studio.hours) && studio.hours.length) ? studio.hours : HOURS;

  // Social / contact links from the configurator.
  const socials = (studio && studio.socials) || {};
  const wa = (studio && studio.whatsapp) || "";
  const socialLinks = [
    socials.instagram && { label: "Instagram", href: socials.instagram },
    socials.facebook && { label: "Facebook", href: socials.facebook },
    socials.tiktok && { label: "TikTok", href: socials.tiktok },
    socials.website && { label: "Website", href: socials.website },
    wa && { label: "WhatsApp", href: wa.startsWith("http") ? wa : `https://wa.me/${wa.replace(/[^0-9]/g, "")}` },
  ].filter(Boolean);

  return (
    <React.Fragment>
      {hasReviews && (
      <section className="vn-section" id="reviews">
        <div className="sey-container">
          <div className="vn-reviews-head">
            <div>
              <div className="sey-eyebrow vn-eyebrow">Loved by guests</div>
              <h2 className="vn-sec-title">What people <em className="sey-accent-italic">say.</em></h2>
            </div>
            <div className="vn-score">
              <span className="vn-score-num">{rating}</span>
              <span className="vn-score-stars">{[0,1,2,3,4].map(i=><Icon key={i} name="star" size={16} color="var(--brass)" />)}</span>
              <span className="vn-score-count">{reviewCount} reviews</span>
            </div>
          </div>
          <div className="vn-reviews">
            {reviews.map((r, i) => (
              <figure className="vn-review" key={r.name + i}>
                <div className="vn-quote-rating">{[0,1,2,3,4].map(j=><Icon key={j} name="star" size={14} color={j < r.rating ? "var(--brass)" : "var(--line-strong)"} />)}</div>
                <blockquote>{r.text}</blockquote>
                <figcaption className="vn-review-by">
                  {r.img
                    ? <img src={avatar(r.img)} alt="" loading="lazy" />
                    : <span className="vn-review-ava" aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--blush)", color: "var(--clay)", fontWeight: 700, flex: "none" }}>{(r.name || "G")[0]}</span>}
                  <span><span className="vn-member-name">{r.name}</span><span className="vn-member-role">{r.when}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className={"vn-section" + (hasReviews ? " vn-alt" : "")} id="visit">
        <div className="sey-container vn-visit">
          <div className="vn-visit-info">
            <div className="sey-eyebrow vn-eyebrow">Visit us</div>
            <h2 className="vn-sec-title">{location.split(",")[0]}, <em className="sey-accent-italic">{(location.split(",")[1] || "Mahé").trim()}.</em></h2>
            <p className="vn-address"><Icon name="pin" size={18} color="var(--clay)" /> {location}, Seychelles</p>
            <table className="vn-hours">
              <tbody>
                {hours.map(([d,h]) => (<tr key={d}><th>{d}</th><td>{h}</td></tr>))}
              </tbody>
            </table>
            {socialLinks.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "4px 0 20px" }}>
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ color: "var(--clay)", fontWeight: 600, fontSize: "var(--text-sm)" }}>{s.label} ↗</a>
                ))}
              </div>
            )}
            <Button size="lg" href="#services" as="a">Book a treatment</Button>
          </div>
          <div className="vn-map" aria-hidden="true">
            <span className="vn-map-pin"><Icon name="pin" size={20} color="var(--surface)" /></span>
            <span className="vn-map-label">{location.split(",")[0]}</span>
          </div>
        </div>
      </section>

      <footer className="vn-footer">
        <div className="sey-container vn-footer-inner">
          <div>
            <div className="vn-brand vn-brand--foot"><span className="vn-brand-mark">{mark}</span>{word && <span className="vn-brand-word">{word}</span>}</div>
            <p>{location} · powered by sey.la | book</p>
          </div>
          <a className="vn-powered" href="/">
            Bookings powered by <b>sey.la&nbsp;|&nbsp;book</b>
          </a>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default VenueClose;
