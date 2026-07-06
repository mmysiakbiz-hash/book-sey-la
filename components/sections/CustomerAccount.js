"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { BookingCard } from "@/components/booking/BookingCard";
import { StudioCard } from "@/components/booking/StudioCard";
import { ClassCard } from "@/components/booking/ClassCard";
// CustomerAccount — client "My account": upcoming, past, favourites.


const U = "https://images.unsplash.com/photo-";

const UPCOMING = [
  { service: "Coconut & Frangipani massage", studio: "Kreol Spa · Beau Vallon", when: "Tomorrow · 14:30", price: "€55", status: "Confirmed", icon: "spa" },
  { service: "Skin fade & style", studio: "Palm & Blade · Victoria", when: "Sat 4 May · 11:00", price: "€22", status: "Confirmed", icon: "barber" },
];
const PAST = [
  { service: "Signature facial", studio: "Island Glow · La Digue", when: "12 Apr · 16:00", price: "€48", status: "Completed", icon: "sparkle" },
  { service: "Gel manicure", studio: "Frangipani Nails · Praslin", when: "28 Mar · 10:30", price: "€25", status: "Completed", icon: "nails" },
];
const FAVES = [
  { name: "Kreol Spa", location: "Beau Vallon, Mahé", category: "Spa & massage", image: U+"1519823551278-64ac92734fb1", rating: 4.9, reviews: 214,
    services: [{ name: "Coconut & Frangipani massage", duration: "60 min", price: "€55" }] },
  { name: "Palm & Blade", location: "Victoria, Mahé", category: "Barber", image: U+"1512864084360-7c0c4d0a0845", rating: 4.8, reviews: 132,
    services: [{ name: "Skin fade & style", duration: "40 min", price: "€22" }] },
  { name: "Zen Shore", location: "Anse Royale, Mahé", category: "Spa & massage", image: U+"1696841212541-449ca29397cc", rating: 5.0, reviews: 87,
    services: [{ name: "Hot stone therapy", duration: "75 min", price: "€65" }] },
];

function ApptRow({ b, actions }) {
  return (
    <div className="ca-appt">
      <BookingCard {...b} style={{ maxWidth: "none" }} />
      <div className="ca-appt-actions">{actions}</div>
    </div>
  );
}

function CustomerAccount() {
  const [tab, setTab] = React.useState("upcoming");
  const TABS = [["upcoming","Upcoming"],["past","Past"],["favourites","Favourites"]];
  return (
    <React.Fragment>
      <header className="ca-nav">
        <div className="sey-container ca-nav-inner">
          <Logo />
          <div className="ca-nav-right">
            <a href="/search">Browse</a>
            <span className="ca-avatar">S</span>
          </div>
        </div>
      </header>

      <section className="ca-head">
        <div className="sey-container">
          <div className="ca-hello">
            <div>
              <div className="sey-eyebrow ca-eyebrow">My account</div>
              <h1 className="ca-title">Hi, <em className="sey-accent-italic">Sofia</em></h1>
            </div>
            <Button as="a" href="/search">Book something new</Button>
          </div>
          <div className="ca-tabs" role="tablist">
            {TABS.map(([k,l]) => (
              <button key={k} role="tab" aria-selected={tab===k} className={"ca-tab"+(tab===k?" is-active":"")} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="ca-body">
        <div className="sey-container">
          {tab==="upcoming" && (
            <div className="ca-list">
              <div className="ca-sub">Appointments</div>
              {UPCOMING.map((b,i)=>(
                <ApptRow key={i} b={b} actions={<React.Fragment>
                  <Button variant="secondary" size="sm">Reschedule</Button>
                  <button className="ca-link">Cancel</button>
                </React.Fragment>} />
              ))}
              <div className="ca-note"><Icon name="clock" size={15} color="var(--eucalyptus)" /> Free to cancel up to 12 hours before your visit.</div>
              <div className="ca-sub" style={{marginTop:"18px"}}>Booked classes</div>
              <ClassCard day="Mon" time="07:00" name="Sunrise beach yoga" instructor="Kreol Spa · with Aline" duration="60 min" level="All levels" price="€18" spotsLeft={6} capacity={14} />
              <ClassCard day="Sat" time="08:00" name="Personal training · small group" instructor="North Shore Fitness · with Denis" duration="45 min" level="Intermediate" price="€25" spotsLeft={2} capacity={6} />
            </div>
          )}
          {tab==="past" && (
            <div className="ca-list">
              {PAST.map((b,i)=>(
                <ApptRow key={i} b={b} actions={<React.Fragment>
                  <Button variant="secondary" size="sm">Rebook</Button>
                  <button className="ca-link">Leave a review</button>
                </React.Fragment>} />
              ))}
            </div>
          )}
          {tab==="favourites" && (
            <div className="ca-faves">
              {FAVES.map(s => <StudioCard key={s.name} {...s} />)}
            </div>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

export default CustomerAccount;
