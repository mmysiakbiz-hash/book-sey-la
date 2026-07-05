"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { SearchBar } from "@/components/booking/SearchBar";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/brand/Icon";
// FinalCTA + Footer — closing call to action and footer (no sey.la family).



function FinalCTA() {
  return (
    <React.Fragment>
      <section className="lp-section lp-final">
        <div className="lp-bloom lp-bloom--final" aria-hidden="true"></div>
        <div className="sey-container lp-final-inner">
          <h2 className="lp-final-title">
            Your next <em className="sey-accent-italic">cut, massage or ritual</em> is one search away.
          </h2>
          <p className="lp-final-lead">See open slots near you right now — it's free.</p>
          <div className="lp-final-search"><SearchBar cta="Find a studio" /></div>
        </div>
      </section>

      <footer className="lp-footer" id="studios">
        <div className="sey-container">
          <div className="lp-footer-top lp-footer-top--simple">
            <div className="lp-footer-brand">
              <Logo color="var(--cream)" mono />
              <p>Real-time booking for beauty &amp; wellness across the Seychelles.</p>
              <a className="lp-footer-studios" href="#">
                List your studio <Icon name="arrowRight" size={16} />
              </a>
            </div>
            <nav className="lp-footer-nav" aria-label="Footer">
              <a href="#categories">Explore</a>
              <a href="#studios-featured">Featured studios</a>
              <a href="#how">How it works</a>
              <a href="#trust">Why sey.la</a>
            </nav>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 sey.la</span>
            <div className="lp-footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default FinalCTA;
