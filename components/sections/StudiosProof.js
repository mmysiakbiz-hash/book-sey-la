"use client";
import React from "react";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Icon } from "@/components/brand/Icon";
// StudiosProof — real platform capabilities that set sey.la apart (no fake
// stats or testimonials; those return once there are genuine ones to show).



const FEATURES = [
  { icon: "sparkle", title: "Loyalty that brings them back", body: "Digital stamp cards reward your regulars automatically after a set number of visits — no punch cards to lose." },
  { icon: "fitness", title: "Classes & waitlists", body: "Run group classes with live seat counts, and let clients join a waitlist automatically when a session fills up." },
  { icon: "calendar", title: "Packages & memberships", body: "Sell prepaid bundles and memberships — remaining credits are tracked for you and redeemed at checkout." },
  { icon: "pin", title: "Your page, and a widget", body: "A polished public page comes built in — plus a one-line widget to drop your live calendar onto your own site or Instagram bio." },
  { icon: "shield", title: "Real multi-team scheduling", body: "Add each team member with their own working hours and calendar — bookings only offer times when that person actually works." },
  { icon: "heart", title: "Automatic email reminders", body: "Every booking gets an instant email confirmation, and a reminder goes out before the visit — cutting no-shows without any manual texting." },
];

function StudiosProof() {
  return (
    <section className="st-section st-alt">
      <div className="sey-container">
        <SectionHeader
          eyebrow="More than a booking button"
          title="Tools that grow your"
          accent="studio."
          intro="Everything runs in one calm dashboard — from loyalty and classes to your own embeddable booking page."
        />
        <div className="st-values">
          {FEATURES.map((f) => (
            <article className="st-value" key={f.title}>
              <span className="st-value-icon"><Icon name={f.icon} size={24} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudiosProof;
