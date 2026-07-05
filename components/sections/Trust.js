"use client";
import React from "react";
import { TrustPoint } from "@/components/booking/TrustPoint";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Icon } from "@/components/brand/Icon";
// Trust — 4 reassurance points on shell-alt.



function Trust() {
  return (
    <section className="lp-section lp-alt" id="trust">
      <div className="sey-container">
        <SectionHeader
          eyebrow="Calm, by design"
          title="Booking you can"
          accent="trust."
        />
        <div className="lp-trust">
          <TrustPoint icon={<Icon name="shield" />} title="Verified local studios">
            Only vetted salons and spas across the Seychelles — no chains, no surprises.
          </TrustPoint>
          <TrustPoint icon={<Icon name="heart" />} title="Always free for you">
            No booking fees, ever. You pay the studio for the service, nothing more.
          </TrustPoint>
          <TrustPoint icon={<Icon name="clock" />} title="Real-time calendars">
            Availability comes straight from each studio's live calendar.
          </TrustPoint>
          <TrustPoint icon={<Icon name="calendar" />} title="Cancel free">
            Change your mind? Cancel free up to 12 hours before your visit.
          </TrustPoint>
        </div>
      </div>
    </section>
  );
}

export default Trust;
