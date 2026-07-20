"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Icon } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
// StudiosClose — pricing clarity, final sign-up CTA, and B2B footer.



const INCLUDED = [
  "Live real-time calendar",
  "Verified local listing",
  "Automatic email reminders",
  "Cancellation protection",
  "Client & loyalty tools",
  "Always free for your clients",
];

function StudiosClose() {
  return (
    <React.Fragment>
      <section className="st-section" id="pricing">
        <div className="sey-container">
          <div className="st-pricing">
            <div className="st-price-head">
              <span className="st-price-amt">Free</span>
              <span className="st-price-per">for 3 months</span>
            </div>
            <div className="st-price-flat">then <b>€25</b> / month per studio — includes 1 team member · <b>+€25</b> for each extra team member</div>
            <ul className="st-price-list">
              {INCLUDED.map((f) => (
                <li key={f}><Icon name="check" size={17} color="var(--eucalyptus)" /> {f}</li>
              ))}
            </ul>
            <Button full size="lg" as="a" href="/panel">Create your studio account</Button>
          </div>
        </div>
      </section>

      <section className="st-section st-final">
        <div className="lp-bloom lp-bloom--final" aria-hidden="true"></div>
        <div className="sey-container st-final-inner">
          <h2 className="st-final-title">Ready to open your <em className="sey-accent-italic">calendar?</em></h2>
          <p className="st-final-lead">Join the studios booking through sey.la across the Seychelles.</p>
          <form className="st-final-form" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Your studio email" aria-label="Studio email" containerStyle={{ flex: 1 }} />
            <Button as="a" href="/panel" size="md">Get started</Button>
          </form>
        </div>
      </section>

      <footer className="st-footer">
        <div className="sey-container st-footer-inner">
          <div className="st-footer-brand">
            <Logo color="var(--cream)" mono />
            <p>The calm way to run a full calendar — for beauty &amp; wellness studios across the Seychelles.</p>
          </div>
          <nav className="st-footer-nav" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="/">For clients ↗</a>
          </nav>
        </div>
        <div className="sey-container st-footer-bottom">
          <span>© 2026 sey.la</span>
          <div className="st-footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Support</a></div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default StudiosClose;
