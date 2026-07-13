"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "@/components/booking/SearchBar";
import { StudioCard } from "@/components/booking/StudioCard";
import { ClassCard } from "@/components/booking/ClassCard";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { Select } from "@/components/core/Select";
import { StudioMap } from "@/components/booking/StudioMap";
// SearchPage — client-facing browse / results page in the sey.la | book pattern.


const U = "https://images.unsplash.com/photo-";

const CHIPS = ["All", "Hair", "Barber", "Nails", "Brows & lashes", "Spa & massage", "Skin & facial", "Makeup", "Waxing", "Tattoo", "Piercing", "Fitness & yoga", "Personal trainer", "Classes"];

// Real group classes aren't wired into the marketplace search yet — keep this
// empty so the Classes tab shows a clean empty state instead of demo data.
const CLASSES = [];

const SORTS = ["Recommended", "Top rated", "Nearest", "Price: low to high"];

function SearchPage({ studios, initialCat, initialQ = "", initialLoc = "" }) {
  const [cat, setCat] = React.useState(initialCat && CHIPS.includes(initialCat) ? initialCat : "All");
  const [sort, setSort] = React.useState("Recommended");
  const [mapOpen, setMapOpen] = React.useState(false);
  const [q, setQ] = React.useState(initialQ);
  const [loc, setLoc] = React.useState(initialLoc);
  const isClasses = cat === "Classes";
  // Real studios only — no demo fallback here (the empty state handles none).
  // (rev2 — force recompile)
  const SOURCE = Array.isArray(studios) ? studios : [];
  const priceOf = (s) => parseInt(String(s.services && s.services[0] ? s.services[0].price : "0").replace(/[^\d]/g, ""), 10) || 0;
  // Free-text match across name, category, area and service names; plus a
  // separate location contains-match. Empty query = everything.
  const ql = q.trim().toLowerCase();
  const locl = loc.trim().toLowerCase();
  const matchText = (s) => {
    if (ql) {
      const hay = [s.name, s.category, s.location, ...((s.services || []).map((x) => x.name))].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(ql)) return false;
    }
    if (locl && !`${s.location || ""} ${s.island || ""}`.toLowerCase().includes(locl)) return false;
    return true;
  };
  let results = SOURCE.filter(s => (cat === "All" || s.category === cat) && matchText(s));
  if (sort === "Top rated") results = [...results].sort((a,b)=>(b.rating||0)-(a.rating||0));
  if (sort === "Price: low to high") results = [...results].sort((a,b)=>priceOf(a)-priceOf(b));

  return (
    <React.Fragment>
      <header className="sr-nav">
        <div className="sey-container sr-nav-inner">
          <Logo />
          <div className="sr-nav-right">
            <a href="/for-studios">For studios</a>
            <Button variant="ghost" size="sm" as="a" href="/login">Log in</Button>
          </div>
        </div>
      </header>

      <section className="sr-head">
        <div className="sey-container">
          <h1 className="sr-title">Browse studios in the <em className="sey-accent-italic">Seychelles</em></h1>
          <div className="sr-search"><SearchBar cta="Search" initialQ={q} initialLoc={loc} onSubmit={({ q, loc }) => { setQ(q); setLoc(loc); }} /></div>
          <div className="sr-chips">
            {CHIPS.map(c => {
              const n = c === "All" ? SOURCE.length : c === "Classes" ? CLASSES.length : SOURCE.filter(s => s.category === c).length;
              return (
                <button key={c} className={"sr-chip" + (cat===c ? " is-active" : "")} onClick={() => setCat(c)}>
                  {c}{n > 0 && <span style={{ marginLeft: 6, opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>{n}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-body">
        <div className="sey-container">
          <div className="sr-meta">
            <span className="sr-count">{isClasses ? (<React.Fragment><b>{CLASSES.length}</b> classes this week across the islands</React.Fragment>) : (<React.Fragment><b>{results.length}</b> studio{results.length!==1?"s":""}{cat!=="All" ? " · " + cat : ""} on Mahé, Praslin &amp; La Digue</React.Fragment>)}</span>
            <div className="sr-controls">
              <div className="sr-sort">
                <span>Sort</span>
                <Select value={sort} onChange={setSort} options={SORTS} ariaLabel="Sort studios" align="right" style={{ minWidth: 170 }} />
              </div>
              <button className={"sr-maptoggle" + (mapOpen ? " is-active" : "")} onClick={()=>setMapOpen(v=>!v)}>
                <Icon name="pin" size={16} color={mapOpen ? "var(--surface)" : "var(--clay)"} /> {mapOpen ? "Hide map" : "Map"}
              </button>
            </div>
          </div>

          <div className={"sr-layout" + (mapOpen && !isClasses ? " sr-layout--map" : "")}>
            {isClasses ? (
              CLASSES.length === 0 ? (
                <div className="sr-empty">
                  <h3>No classes yet</h3>
                  <p>Group classes will appear here as studios add them.</p>
                </div>
              ) : (
              <div className="sr-classes">
                {CLASSES.map((c,i) => <ClassCard key={i} {...c} />)}
              </div>
              )
            ) : (
            <div className="sr-grid">
              {results.length === 0 ? (
                (ql || locl) ? (
                  <div className="sr-empty">
                    <h3>No studios match your search</h3>
                    <p>Try a different treatment or place{cat !== "All" ? `, or clear the ${cat} filter` : ""}.</p>
                  </div>
                ) : (
                  <div className="sr-empty">
                    <h3>No studios here yet</h3>
                    <p>We're onboarding {cat.toLowerCase()} studios across the islands. Check back soon.</p>
                  </div>
                )
              ) : results.map(s => <StudioCard key={s.slug || s.name} {...s} as="a" href={s.href || (s.slug ? "/studio/" + s.slug : "#")} />)}
            </div>
            )}
            {mapOpen && !isClasses && (
              <aside className="sr-map" aria-label="Map">
                <div className="sr-map-inner">
                  {/* Real OpenStreetMap (Leaflet) with a pin per studio that has
                      coordinates (geocoded from its address on save). */}
                  <StudioMap studios={results} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      <footer className="sr-footer">
        <div className="sey-container sr-footer-inner">
          <Logo />
          <nav className="sr-footer-nav">
            <a href="/">Home</a>
            <a href="/for-studios">For studios</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <span className="sr-footer-copy">© 2026 sey.la · Always free for clients</span>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default SearchPage;
