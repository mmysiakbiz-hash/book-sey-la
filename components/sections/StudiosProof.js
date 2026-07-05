"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";
// StudiosProof — stats + three diverse studio-owner testimonials on shell-alt.



const U = "https://images.unsplash.com/photo-";
const QUOTES = [
  {
    quote: "The chairs used to sit empty between walk-ins. Now clients book the night before and my mornings run full — without a single phone call.",
    name: "Marcus R.", role: "Owner · Palm & Blade barbershop, Victoria",
    image: U + "1512864084360-7c0c4d0a0845",
  },
  {
    quote: "Tourists find us the evening before their treatment and book in seconds. My calendar fills itself while I'm with a client.",
    name: "Aline D.", role: "Owner · Kreol Spa, Beau Vallon",
    image: U + "1519699047748-de8e457a634e",
  },
  {
    quote: "Clients book their sessions and pay in the app. I just show up on the beach and coach — no chasing, no admin.",
    name: "Sasha M.", role: "Personal trainer · Anse Royale",
    image: U + "1632765854612-9b02b6ec2b15",
  },
];

function StudiosProof() {
  return (
    <section className="st-section st-alt">
      <div className="sey-container">
        <div className="st-stats">
          <div className="st-stat"><b>180+</b><span>island studios</span></div>
          <div className="st-stat"><b>12k</b><span>bookings a month</span></div>
          <div className="st-stat"><b>4.9</b><span>avg studio rating</span></div>
          <div className="st-stat"><b>0%</b><span>client booking fees</span></div>
        </div>
        <div className="st-testimonials">
          {QUOTES.map((q) => (
            <figure className="st-tcard" key={q.name}>
              <div className="st-quote-rating" aria-label="5 out of 5">
                {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={15} color="var(--brass)" />)}
              </div>
              <blockquote>{q.quote}</blockquote>
              <figcaption className="st-tcard-by">
                <img className="st-tcard-avatar" src={q.image + "?auto=format&fit=crop&w=120&h=120&q=70"} alt="" loading="lazy" />
                <span>
                  <span className="st-quote-name">{q.name}</span>
                  <span className="st-quote-role">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudiosProof;
