"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
// StudiosNav — B2B nav: logo, section links, "for clients", log in, primary CTA.



function StudiosNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="st-nav">
      <div className="st-nav-inner sey-container">
        <div className="st-nav-left">
          <Logo />
          <span className="st-nav-tag">for studios</span>
        </div>
        <nav className="st-nav-links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a className="st-nav-clients" href="../landing/index.html">For clients ↗</a>
          <Button variant="ghost" size="sm">Log in</Button>
          <Button size="sm">List your studio</Button>
        </nav>
        <button className="st-nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <div className="st-nav-mobile sey-container">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#how" onClick={() => setOpen(false)}>How it works</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          <a href="../landing/index.html">For clients ↗</a>
          <Button full>List your studio</Button>
        </div>
      )}
    </header>
  );
}

export default StudiosNav;
