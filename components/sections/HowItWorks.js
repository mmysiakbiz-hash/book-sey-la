"use client";
import React from "react";
import { StepCard } from "@/components/booking/StepCard";
import { SectionHeader } from "@/components/core/SectionHeader";
import { Icon } from "@/components/brand/Icon";
// HowItWorks — 3 steps on the dark cocoa band.



function HowItWorks() {
  return (
    <section className="lp-section lp-cocoa" id="how">
      <div className="sey-container">
        <SectionHeader
          onDark
          eyebrow="Booked in seconds"
          title="How it"
          accent="works."
          intro="No calls, no waiting. Real calendars from real studios, updated live."
        />
        <div className="lp-steps">
          <StepCard step="01" title="Find a studio" icon={<Icon name="search" />}>
            Search verified salons and spas near you across Mahé, Praslin and La Digue.
          </StepCard>
          <StepCard step="02" title="Pick a slot" icon={<Icon name="calendar" />}>
            See real-time availability and choose the time that suits your day.
          </StepCard>
          <StepCard step="03" title="Show up" icon={<Icon name="check" />}>
            Get instant confirmation, then simply arrive and enjoy your ritual.
          </StepCard>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
