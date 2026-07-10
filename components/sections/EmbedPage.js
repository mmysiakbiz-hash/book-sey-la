"use client";
import React, { useState } from "react";

// EmbedPage — "put your calendar on your site": one-line snippet + live, interactive widget preview.
// Ported from ui_kits/embed. Styling lives in globals.css (.em-*, .pg-*).

const SNIPPET = `<script src="https://embed.book.sey.la/widget.js"
        data-studio="kreol-spa"
        data-accent="#A8503F"
        data-theme="warm"></script>`;

const ACCENTS = [
  { c: "var(--clay)", label: "Clay" },
  { c: "var(--eucalyptus)", label: "Eucalyptus" },
  { c: "var(--cocoa)", label: "Cocoa" },
  { c: "var(--brass)", label: "Brass" },
];
const DAYS = ["Today", "Tomorrow", "Sat", "Sun"];
const SLOTS = ["10:00", "14:30", "16:00", "17:15", "18:00", "18:45"];

function EmbedPage() {
  const [accent, setAccent] = useState("var(--clay)");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("14:30");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    try {
      navigator.clipboard && navigator.clipboard.writeText(SNIPPET);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <header className="pg-nav">
        <div className="pg-nav-inner">
          <a className="pg-logo" href="/"><b>sey.la</b><span className="sep">|</span><i>book</i></a>
          <nav className="pg-nav-right">
            <a href="/search">Browse</a>
            <a href="/for-studios">For studios</a>
            <a className="pg-btn" href="/panel">Business panel</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="pg-wrap pg-wrap--wide">
          <section className="pg-hero" style={{ textAlign: "left" }}>
            <div className="pg-eyebrow">For studios</div>
            <h1>Put your calendar on <em>your</em> site</h1>
            <p className="lead" style={{ margin: 0 }}>
              Already have a website or Instagram link-in-bio? Add your live booking
              calendar with one line of HTML — clients book without leaving your page.
            </p>
          </section>

          <section className="em-grid">
            <div>
              <ol className="em-steps">
                <li><b>Copy the snippet</b><span>Paste it where you want the calendar to appear.</span></li>
                <li><b>It loads your live availability</b><span>Synced with your sey.la | book calendar in real time.</span></li>
                <li><b>Clients book inline</b><span>No redirects, no fees — bookings land straight in your panel.</span></li>
              </ol>

              <div className="em-code">
                <button className="em-copy" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
                <pre>
                  <span className="tok-tag">&lt;script</span> <span className="tok-attr">src</span>=<span className="tok-str">"https://embed.book.sey.la/widget.js"</span>
{"\n        "}<span className="tok-attr">data-studio</span>=<span className="tok-str">"kreol-spa"</span>
{"\n        "}<span className="tok-attr">data-accent</span>=<span className="tok-str">"#A8503F"</span>
{"\n        "}<span className="tok-attr">data-theme</span>=<span className="tok-str">"warm"</span><span className="tok-tag">&gt;&lt;/script&gt;</span>
                </pre>
              </div>

              <div className="em-opts">
                <div>
                  <div className="em-opt-lbl">Accent</div>
                  <div className="em-swatches">
                    {ACCENTS.map((a) => (
                      <button
                        key={a.c}
                        className={"em-swatch" + (accent === a.c ? " is-active" : "")}
                        style={{ background: a.c }}
                        aria-label={a.label}
                        onClick={() => setAccent(a.c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="pg-body" style={{ marginTop: 18, fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>
                Works on any site — Wix, Squarespace, WordPress or plain HTML. Free with your studio subscription.
              </p>
            </div>

            <div className="em-preview">
              <div className="em-preview-head">Live widget preview</div>
              <div className="em-widget" style={{ "--em-accent": accent }}>
                <div className="em-w-head">Kreol Spa<span>Book online · Beau Vallon, Mahé</span></div>
                <div className="em-w-body">
                  <label htmlFor="em-srv">Service</label>
                  <select id="em-srv" defaultValue="0">
                    <option value="0">Coconut &amp; Frangipani massage · SCR 55</option>
                    <option value="1">Signature facial · SCR 48</option>
                    <option value="2">Hot stone therapy · SCR 65</option>
                  </select>
                  <div className="em-w-days">
                    {DAYS.map((d, i) => (
                      <button key={d} className={"em-chip" + (day === i ? " is-active" : "")} onClick={() => setDay(i)}>{d}</button>
                    ))}
                  </div>
                  <div className="em-w-slots">
                    {SLOTS.map((s) => (
                      <button key={s} className={"em-slot" + (slot === s ? " is-active" : "")} onClick={() => setSlot(s)}>{s}</button>
                    ))}
                  </div>
                  <button className="em-w-book">Book · {slot}</button>
                </div>
                <div className="em-w-powered">powered by <b>sey.la&nbsp;|&nbsp;book</b></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="pg-footer">
        <div className="pg-footer-inner">
          <a className="pg-logo" href="/"><b>sey.la</b><span className="sep">|</span><i>book</i></a>
          <nav className="pg-footer-nav">
            <a href="/">Home</a>
            <a href="/for-studios">For studios</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="pg-footer-copy">© 2026 sey.la · Operated by Nexora Consulting LLC, Sharjah Media City, UAE</div>
        </div>
      </footer>
    </>
  );
}

export default EmbedPage;
