"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
// Nav — sticky translucent shell nav with logo, family switcher, links, log in.



function Nav() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="lp-nav">
      <div className="lp-nav-inner sey-container">
        <div className="lp-nav-left">
          <Logo />
        </div>
        <nav className="lp-nav-links" aria-label="Primary">
          <a href="#categories">Explore</a>
          <a href="#how">How it works</a>
          <a href="#studios">For studios</a>
          <Button variant="ghost" size="sm" as="a" href="/login">Log in</Button>
        </nav>
        <button className="lp-nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <div className="lp-nav-mobile sey-container">
          <a href="#categories" onClick={() => setOpen(false)}>Explore</a>
          <a href="#how" onClick={() => setOpen(false)}>How it works</a>
          <a href="#studios" onClick={() => setOpen(false)}>For studios</a>
          <Button variant="secondary" full as="a" href="/login">Log in</Button>
        </div>
      )}
    </header>
  );
}

export default Nav;
