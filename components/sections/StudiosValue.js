"use client";
import React from "react";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Icon } from "@/components/brand/Icon";
// StudiosValue — the core value props for studios.



const VALUES = [
  { icon: "clock", title: "A calendar that fills itself", body: "Your real availability, live. Clients book open slots in seconds — no calls, no double-bookings, no back-and-forth." },
  { icon: "heart", title: "No commission on your clients", body: "Booking is always free for them and there's no cut of your service price. You set your rates, you keep them." },
  { icon: "pin", title: "Verified local visibility", body: "Get featured to tourists and residents across Mahé, Praslin and La Digue — whether you run a spa, barbershop, nail bar, tattoo studio or train clients one-to-one." },
  { icon: "shield", title: "Fewer no-shows", body: "Automatic reminders and cancellations locked 12 hours before the visit keep your chairs full and your day calm." },
];

function StudiosValue() {
  return (
    <section className="st-section" id="features">
      <div className="sey-container">
        <SectionHeader
          eyebrow="Why studios choose sey.la"
          title="Everything you need to stay"
          accent="booked."
          intro="Built for island salons, barbers, spas and studios — the calm way to run a full calendar."
        />
        <div className="st-values">
          {VALUES.map((v) => (
            <article className="st-value" key={v.title}>
              <span className="st-value-icon"><Icon name={v.icon} size={24} /></span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudiosValue;
