"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "@/components/booking/SearchBar";
import { StudioCard } from "@/components/booking/StudioCard";
import { ClassCard } from "@/components/booking/ClassCard";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
// SearchPage — client-facing browse / results page in the sey.la | book pattern.


const U = "https://images.unsplash.com/photo-";

const CHIPS = ["All", "Hair", "Barber", "Nails", "Brows & lashes", "Spa & massage", "Skin & facial", "Makeup", "Waxing", "Tattoo", "Piercing", "Fitness & yoga", "Personal trainer", "Classes"];

// Real group classes aren't wired into the marketplace search yet — keep this
// empty so the Classes tab shows a clean empty state instead of demo data.
const CLASSES = [];

const STUDIOS = [
  { name: "Kreol Spa", location: "Beau Vallon, Mahé", category: "Spa & massage", image: U+"1519823551278-64ac92734fb1", rating: 4.9, reviews: 214, badge: "Popular",
    services: [{ name: "Coconut & Frangipani massage", duration: "60 min", price: "€55" }, { name: "Signature facial", duration: "50 min", price: "€48" }] },
  { name: "Palm & Blade", location: "Victoria, Mahé", category: "Barber", image: U+"1512864084360-7c0c4d0a0845", rating: 4.8, reviews: 132, badge: "Loved by locals",
    services: [{ name: "Skin fade & style", duration: "40 min", price: "€22" }, { name: "Beard trim & hot towel", duration: "25 min", price: "€16" }] },
  { name: "Lumière Studio", location: "Victoria, Mahé", category: "Hair", image: U+"1632765866070-3fadf25d3d5b", rating: 4.8, reviews: 176,
    services: [{ name: "Cut & blow-dry", duration: "45 min", price: "€30" }, { name: "Braids & styling", duration: "120 min", price: "€60" }] },
  { name: "North Shore Grooming", location: "Beau Vallon, Mahé", category: "Barber", image: U+"1699641975121-5c3f55a553e5", rating: 4.9, reviews: 121,
    services: [{ name: "Cut, beard & hot towel", duration: "45 min", price: "€26" }, { name: "Sports recovery massage", duration: "30 min", price: "€32" }] },
  { name: "Frangipani Nails", location: "Grand Anse, Praslin", category: "Nails", image: U+"1632345031435-8727f6897d53", rating: 4.9, reviews: 98,
    services: [{ name: "Gel manicure", duration: "45 min", price: "€25" }, { name: "Spa pedicure", duration: "60 min", price: "€35" }] },
  { name: "Island Glow", location: "La Digue", category: "Brows & lashes", image: U+"1632765854612-9b02b6ec2b15", rating: 4.7, reviews: 64, available: "",
    services: [{ name: "Brow lamination", duration: "40 min", price: "€35" }, { name: "Lash lift & tint", duration: "50 min", price: "€42" }] },
  { name: "Zen Shore", location: "Anse Royale, Mahé", category: "Spa & massage", image: U+"1696841212541-449ca29397cc", rating: 5.0, reviews: 87,
    services: [{ name: "Hot stone therapy", duration: "75 min", price: "€65" }, { name: "Scalp ritual", duration: "30 min", price: "€30" }] },
  { name: "Takamaka Wellness", location: "Takamaka, Mahé", category: "Skin & facial", image: U+"1570172619644-dfd03ed5d881", rating: 4.8, reviews: 73,
    services: [{ name: "Volcanic clay facial", duration: "50 min", price: "€44" }, { name: "Deep-tissue massage", duration: "60 min", price: "€58" }] },
  { name: "Coco Makeup Bar", location: "Victoria, Mahé", category: "Makeup", image: U+"1516975080664-ed2fc6a32937", rating: 4.7, reviews: 52,
    services: [{ name: "Event makeup", duration: "60 min", price: "€48" }, { name: "Bridal trial", duration: "90 min", price: "€70" }] },
];

const SORTS = ["Recommended", "Top rated", "Nearest", "Price: low to high"];

function SearchPage({ studios }) {
  const [cat, setCat] = React.useState("All");
  const [sort, setSort] = React.useState("Recommended");
  const [mapOpen, setMapOpen] = React.useState(false);
  const isClasses = cat === "Classes";
  // Real studios only — no demo fallback here (the empty state handles none).
  const SOURCE = Array.isArray(studios) ? studios : [];
  const priceOf = (s) => parseInt((s.services && s.services[0] ? s.services[0].price : "€0").slice(1), 10) || 0;
  let results = SOURCE.filter(s => cat === "All" || s.category === cat);
  if (sort === "Top rated") results = [...results].sort((a,b)=>(b.rating||0)-(a.rating||0));
  if (sort === "Price: low to high") results = [...results].sort((a,b)=>priceOf(a)-priceOf(b));

  return (
    <React.Fragment>
      <header className="sr-nav">
        <div className="sey-container sr-nav-inner">
          <Logo />
          <div className="sr-nav-right">
            <a href="../studios/index.html">For studios</a>
            <Button variant="ghost" size="sm">Log in</Button>
          </div>
        </div>
      </header>

      <section className="sr-head">
        <div className="sey-container">
          <h1 className="sr-title">Browse studios in the <em className="sey-accent-italic">Seychelles</em></h1>
          <div className="sr-search"><SearchBar withDate cta="Search" /></div>
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
              <label className="sr-sort">
                <span>Sort</span>
                <select value={sort} onChange={e=>setSort(e.target.value)}>
                  {SORTS.map(s=><option key={s}>{s}</option>)}
                </select>
              </label>
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
                <div className="sr-empty">
                  <h3>No studios here yet</h3>
                  <p>We're onboarding {cat.toLowerCase()} studios across the islands. Check back soon.</p>
                </div>
              ) : results.map(s => <StudioCard key={s.slug || s.name} {...s} as="a" href={s.href || (s.slug ? "/studio/" + s.slug : "#")} />)}
            </div>
            )}
            {mapOpen && !isClasses && (
              <aside className="sr-map" aria-label="Map">
                <div className="sr-map-inner">
                  {results.slice(0,6).map((s,i)=>(
                    <span className="sr-map-pin" key={s.slug || s.name} style={{ top: (18+i*12)+"%", left: (20+((i*27)%60))+"%" }}>
                      <Icon name="pin" size={18} color="var(--surface)" />
                    </span>
                  ))}
                  <span className="sr-map-label">Live availability · Beau Vallon</span>
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
            <a href="../landing/index.html">Home</a>
            <a href="../studios/index.html">For studios</a>
            <a href="../pages/about.html">About</a>
            <a href="../pages/contact.html">Contact</a>
          </nav>
          <span className="sr-footer-copy">© 2026 sey.la · Always free for clients</span>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default SearchPage;
