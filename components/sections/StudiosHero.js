"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Badge } from "@/components/core/Badge";
import { Icon } from "@/components/brand/Icon";
import { BookingCard } from "@/components/booking/BookingCard";
// StudiosHero — B2B pitch + sign-up + a live "today at your studio" dashboard preview.



function StudiosHero() {
  return (
    <section className="st-hero">
      <div className="lp-bloom lp-bloom--1" aria-hidden="true"></div>
      <div className="lp-bloom lp-bloom--2" aria-hidden="true"></div>
      <div className="sey-container st-hero-grid">
        <div className="st-hero-copy lp-fade">
          <div className="sey-eyebrow st-hero-eyebrow">For studios &amp; spas · Seychelles</div>
          <h1 className="st-hero-title">
            Fill your calendar.<br />Keep your <em className="sey-accent-italic">calm.</em>
          </h1>
          <p className="st-hero-lead">
            sey.la | book brings verified local clients straight to your live
            calendar — with zero booking fees for them, and no phone tag for you.
          </p>
          <form className="st-hero-form" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Your studio email" aria-label="Studio email" containerStyle={{ flex: 1 }} />
            <Button as="a" href="/panel" size="md">Create studio account</Button>
          </form>
          <div className="st-hero-note">
            <Icon name="check" size={15} color="var(--eucalyptus)" /> Free to start · no card required · live the same day
          </div>
          <div className="st-hero-badges">
            <Badge tone="brand">0% client fees</Badge>
            <Badge tone="botanical">Real-time calendar</Badge>
            <Badge tone="neutral">You keep your clients</Badge>
          </div>
        </div>

        <div className="st-hero-panel lp-fade lp-fade--2">
          <div className="st-panel">
            <div className="st-panel-head">
              <div>
                <div className="st-panel-title">Today · Kreol Spa</div>
                <div className="st-panel-sub">Beau Vallon, Mahé</div>
              </div>
              <span className="st-panel-live"><span className="st-dot"></span> Live</span>
            </div>
            <div className="st-panel-stats">
              <div><b>8</b><span>booked</span></div>
              <div><b>3</b><span>open slots</span></div>
              <div><b>SCR 410</b><span>today</span></div>
            </div>
            <div className="st-panel-list">
              <BookingCard service="Coconut &amp; Frangipani massage" studio="Aline · 60 min" when="14:30" price="SCR 55" status="Confirmed" icon="spa" style={{ maxWidth: "none" }} />
              <BookingCard service="Signature facial" studio="New client · 45 min" when="16:00" price="SCR 48" status="New" icon="sparkle" style={{ maxWidth: "none" }} />
              <BookingCard service="Scalp ritual" studio="Regular · 30 min" when="17:15" price="SCR 30" status="Confirmed" icon="lotus" style={{ maxWidth: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudiosHero;
