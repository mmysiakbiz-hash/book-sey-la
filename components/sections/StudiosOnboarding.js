"use client";
import React from "react";
import { SectionHeader } from "@/components/core/SectionHeader";
import { StepCard } from "@/components/booking/StepCard";
import { Icon } from "@/components/brand/Icon";
// StudiosOnboarding — 3-step "go live" flow on the dark cocoa band.



function StudiosOnboarding() {
  return (
    <section className="st-section st-cocoa" id="how">
      <div className="sey-container">
        <SectionHeader
          onDark
          eyebrow="Live in an afternoon"
          title="From sign-up to first"
          accent="booking."
          intro="No setup fees, no training. Most studios are taking bookings the same day."
        />
        <div className="st-steps">
          <StepCard step="01" title="Create your studio" icon={<Icon name="pin" />}>
            Add your name, location and a few photos. We verify you as a trusted local studio.
          </StepCard>
          <StepCard step="02" title="Add services &amp; hours" icon={<Icon name="calendar" />}>
            List your treatments, prices and opening hours. Your live calendar builds itself.
          </StepCard>
          <StepCard step="03" title="Go live" icon={<Icon name="check" />}>
            Publish and start taking real-time bookings from clients across the islands.
          </StepCard>
        </div>
      </div>
    </section>
  );
}

export default StudiosOnboarding;
