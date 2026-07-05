"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";
import { ClassCard } from "@/components/booking/ClassCard";
// VenueShowcase — about strip, the team, and a photo gallery.


const U = "https://images.unsplash.com/photo-";

const CLASSES = [
  { day: "Mon", time: "07:00", name: "Sunrise beach yoga", instructor: "with Aline", duration: "60 min", level: "All levels", price: "\u20ac18", spotsLeft: 6, capacity: 14 },
  { day: "Wed", time: "18:00", name: "Candlelight yin", instructor: "with Marie", duration: "75 min", level: "Gentle", price: "\u20ac20", spotsLeft: 2, capacity: 10 },
  { day: "Sat", time: "08:00", name: "Personal training \u00b7 small group", instructor: "with Denis", duration: "45 min", level: "Intermediate", price: "\u20ac25", spotsLeft: 0, capacity: 6 },
  { day: "Sun", time: "09:00", name: "Flow & breath", instructor: "with Aline", duration: "60 min", level: "All levels", price: "\u20ac18", spotsLeft: 9, capacity: 14 },
];

const TEAM = [
  { name: "Aline", role: "Founder · Massage therapist", img: U + "1519699047748-de8e457a634e" },
  { name: "Marie", role: "Facialist", img: U + "1632765854612-9b02b6ec2b15" },
  { name: "Denis", role: "Deep-tissue & sports", img: U + "1512864084360-7c0c4d0a0845" },
];

const GALLERY = [
  U + "1540555700478-4be289fbecef",
  U + "1620733723572-11c53f73a416",
  U + "1544161515-4ab6ce6db874",
  U + "1600334089648-b0d9d3028eb2",
  U + "1616394584738-fc6e612e71b9",
  U + "1519823551278-64ac92734fb1",
];

const AMENITIES = [
  { icon: "pin", label: "2 min from the beach" },
  { icon: "heart", label: "Couples' room" },
  { icon: "sparkle", label: "Frangipani tea served" },
  { icon: "check", label: "Free parking" },
];

function VenueShowcase({ studio }) {
  const name = (studio && studio.name) || "Kreol Spa";
  const location = (studio && studio.location) || "Beau Vallon, Mahé";
  const about =
    (studio && (studio.bio || studio.tagline)) ||
    "Tucked behind the takamaka trees at Beau Vallon, Kreol Spa is a small team of island therapists. We work with warm coconut oil, local clay and frangipani — and never rush a treatment.";
  const photos = (studio && Array.isArray(studio.photos) && studio.photos) || [];
  const sized = (u, w) => (u && !u.includes("?") ? u + "?auto=format&fit=crop&w=" + w + "&q=74" : u);
  const aboutPhoto = sized(photos[1] || photos[0] || U + "1600334089648-b0d9d3028eb2", 720);
  // Live gallery only when the studio has enough photos; demo grid otherwise.
  const gallery = photos.length >= 3 ? photos.slice(0, 6) : GALLERY;
  return (
    <React.Fragment>
      <section className="vn-section vn-alt" id="about">
        <div className="sey-container vn-about">
          <div className="vn-about-copy">
            <div className="sey-eyebrow vn-eyebrow">The place</div>
            <h2 className="vn-sec-title">Made for slowing <em className="sey-accent-italic">down.</em></h2>
            <p>{about}</p>
            <ul className="vn-amenities">
              {AMENITIES.map(a => (
                <li key={a.label}><Icon name={a.icon} size={17} color="var(--eucalyptus)" /> {a.label}</li>
              ))}
            </ul>
          </div>
          <div className="vn-about-photo">
            <img src={aboutPhoto} alt={"Inside " + name} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="vn-section" id="team">
        <div className="sey-container">
          <div className="sey-eyebrow vn-eyebrow">Your therapists</div>
          <h2 className="vn-sec-title">The <em className="sey-accent-italic">hands.</em></h2>
          <div className="vn-team">
            {TEAM.map(t => (
              <figure className="vn-member" key={t.name}>
                <img src={t.img + "?auto=format&fit=crop&w=400&h=460&q=72"} alt={t.name} loading="lazy" />
                <figcaption>
                  <span className="vn-member-name">{t.name}</span>
                  <span className="vn-member-role">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="vn-section" id="classes">
        <div className="sey-container">
          <div className="sey-eyebrow vn-eyebrow">Book a spot</div>
          <h2 className="vn-sec-title">Group <em className="sey-accent-italic">classes.</em></h2>
          <p className="vn-classes-intro">Yoga and movement on the sand, plus small-group training. Spots are limited \u2014 grab yours before they fill.</p>
          <div className="vn-classes">
            {ClassCard && CLASSES.map((c, i) => <ClassCard key={i} {...c} />)}
          </div>
        </div>
      </section>

      <section className="vn-section vn-alt" id="gallery">
        <div className="sey-container">
          <div className="sey-eyebrow vn-eyebrow">Inside the spa</div>
          <h2 className="vn-sec-title">A look <em className="sey-accent-italic">around.</em></h2>
          <div className="vn-gallery">
            {gallery.map((g, i) => (
              <figure className={"vn-gcell vn-gcell--" + i} key={i}>
                <img src={g.includes("?") ? g : g + "?auto=format&fit=crop&w=600&q=72"} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default VenueShowcase;
