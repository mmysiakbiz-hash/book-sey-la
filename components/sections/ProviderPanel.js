"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { BookingCard } from "@/components/booking/BookingCard";
import { ClassCard } from "@/components/booking/ClassCard";
// ProviderPanel — business panel with a live "Your page" configurator.


const U = "https://images.unsplash.com/photo-";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "sparkle" },
  { key: "calendar", label: "Calendar", icon: "calendar" },
  { key: "services", label: "Services", icon: "spa" },
  { key: "classes", label: "Classes", icon: "fitness" },
  { key: "page", label: "Your page", icon: "pin" },
  { key: "settings", label: "Settings", icon: "shield" },
];

// Varied aspect ratios on purpose — proves every upload crops cleanly.
const COVERS = [
  { id: "1696841212541-449ca29397cc", label: "Hot stone" },
  { id: "1519823551278-64ac92734fb1", label: "Massage" },
  { id: "1600334089648-b0d9d3028eb2", label: "Still life" },
  { id: "1620733723572-11c53f73a416", label: "Candle" },
  { id: "", label: "No photo" },
];
const ACCENTS = [
  { name: "Clay", val: "var(--clay)" },
  { name: "Eucalyptus", val: "var(--eucalyptus)" },
  { name: "Cocoa", val: "var(--cocoa)" },
  { name: "Brass", val: "var(--brass)" },
];

function Preview({ cfg }) {
  const src = cfg.cover ? U + cfg.cover + "?auto=format&fit=crop&w=900&q=72" : null;
  return (
    <div className="pv-card">
      <div className="pv-cover">
        {src
          ? <img src={src} alt="" />
          : <div className="pv-cover-empty"><Icon name="spa" size={40} color="rgba(252,248,242,0.9)" /></div>}
        <div className="pv-scrim"></div>
        <div className="pv-cover-body">
          <span className="pv-cat"><Icon name="star" size={13} color="var(--brass)" /> 4.9 · {cfg.category}</span>
          <h3 className="pv-name">{cfg.name || "Your studio"}</h3>
          <p className="pv-tag">{cfg.tagline || "Add a short, calm tagline."}</p>
          <span className="pv-book" style={{ background: cfg.accent }}>Book now</span>
        </div>
      </div>
      <div className="pv-srv">
        {cfg.services.map((s, i) => (
          <div className="pv-srv-row" key={i}>
            <span>{s.name || "Service"}</span>
            <b>{s.price || "€—"}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageEditor() {
  const [cfg, setCfg] = React.useState({
    name: "Kreol Spa", tagline: "A quiet island ritual, a few steps from the sand.",
    category: "Spa & massage", cover: "1696841212541-449ca29397cc", accent: "var(--clay)",
    services: [
      { name: "Coconut & Frangipani massage", price: "€55" },
      { name: "Signature facial", price: "€48" },
      { name: "Hot stone therapy", price: "€65" },
    ],
  });
  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const setSrv = (i, k, v) => setCfg(c => ({ ...c, services: c.services.map((s,j)=> j===i ? {...s,[k]:v} : s) }));
  const addSrv = () => setCfg(c => ({ ...c, services: [...c.services, { name: "", price: "" }] }));
  const delSrv = (i) => setCfg(c => ({ ...c, services: c.services.filter((_,j)=>j!==i) }));

  return (
    <div className="pp-page">
      <div className="pp-editor">
        <div className="pp-hint"><Icon name="check" size={16} color="var(--eucalyptus)" /> Whatever photo you upload, we crop, warm-tone and overlay it automatically — your page always looks polished.</div>

        <label className="pp-f"><span>Studio name</span>
          <input value={cfg.name} onChange={e=>set("name", e.target.value)} /></label>
        <label className="pp-f"><span>Tagline</span>
          <input value={cfg.tagline} onChange={e=>set("tagline", e.target.value)} /></label>
        <label className="pp-f"><span>Category</span>
          <select value={cfg.category} onChange={e=>set("category", e.target.value)}>
            {["Spa & massage","Hair","Barber","Nails","Skin & facial","Fitness & yoga"].map(c=><option key={c}>{c}</option>)}
          </select></label>

        <div className="pp-f"><span>Cover photo</span>
          <div className="pp-covers">
            {COVERS.map(c => (
              <button key={c.label} title={c.label}
                className={"pp-cover-opt" + (cfg.cover===c.id ? " is-active" : "") + (c.id==="" ? " pp-cover-none" : "")}
                onClick={()=>set("cover", c.id)}
                style={c.id ? { backgroundImage: `url(${U+c.id}?auto=format&fit=crop&w=140&q=60)` } : undefined}>
                {c.id==="" && <Icon name="close" size={16} color="var(--cocoa-60)" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pp-f"><span>Accent colour</span>
          <div className="pp-swatches">
            {ACCENTS.map(a => (
              <button key={a.name} title={a.name} className={"pp-swatch" + (cfg.accent===a.val ? " is-active" : "")}
                style={{ background: a.val }} onClick={()=>set("accent", a.val)}></button>
            ))}
          </div>
        </div>

        <div className="pp-f"><span>Services</span>
          <div className="pp-srv-list">
            {cfg.services.map((s,i)=>(
              <div className="pp-srv-edit" key={i}>
                <input placeholder="Service name" value={s.name} onChange={e=>setSrv(i,"name",e.target.value)} />
                <input placeholder="€" className="pp-price" value={s.price} onChange={e=>setSrv(i,"price",e.target.value)} />
                <button className="pp-del" onClick={()=>delSrv(i)} aria-label="Remove"><Icon name="close" size={15} color="var(--cocoa-60)" /></button>
              </div>
            ))}
            <button className="pp-add" onClick={addSrv}>+ Add service</button>
          </div>
        </div>

        <div className="pp-actions">
          <Button as="a" href="../venue/index.html">Preview full page ↗</Button>
          <Button variant="secondary">Save &amp; publish</Button>
        </div>
      </div>

      <div className="pp-preview">
        <div className="pp-preview-head">Live preview</div>
        <Preview cfg={cfg} />
      </div>
    </div>
  );
}

function Dashboard() {
  const stats = [
    { n: "8", l: "bookings today" }, { n: "€410", l: "expected today" },
    { n: "3", l: "open slots" }, { n: "4.9", l: "rating" },
  ];
  return (
    <div>
      <div className="pp-trial"><Icon name="sparkle" size={16} color="var(--brass)" /> You're on the <b>3 months free</b> trial · 74 days left</div>
      <div className="pp-stats">
        {stats.map(s => <div className="pp-stat" key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
      </div>
      <h3 className="pp-h">Today · Kreol Spa</h3>
      <div className="pp-today">
        <BookingCard service="Coconut & Frangipani massage" studio="Aline · 60 min" when="14:30" price="€55" status="Confirmed" icon="spa" style={{ maxWidth: "none" }} />
        <BookingCard service="Signature facial" studio="New client · 45 min" when="16:00" price="€48" status="New" icon="sparkle" style={{ maxWidth: "none" }} />
        <BookingCard service="Scalp ritual" studio="Regular · 30 min" when="17:15" price="€30" status="Confirmed" icon="lotus" style={{ maxWidth: "none" }} />
      </div>
    </div>
  );
}

function ClassesView() {
  const [rows, setRows] = React.useState([
    { day: "Mon", time: "07:00", name: "Sunrise beach yoga", instructor: "with Aline", duration: "60 min", level: "All levels", price: "\u20ac18", capacity: 14, booked: 8 },
    { day: "Wed", time: "18:00", name: "Candlelight yin", instructor: "with Marie", duration: "75 min", level: "Gentle", price: "\u20ac20", capacity: 10, booked: 8 },
    { day: "Sat", time: "08:00", name: "Personal training \u00b7 small group", instructor: "with Denis", duration: "45 min", level: "Intermediate", price: "\u20ac25", capacity: 6, booked: 6 },
  ]);
  const setCap = (i, d) => setRows(r => r.map((x, j) => j===i ? { ...x, capacity: Math.max(x.booked, Math.max(1, x.capacity + d)) } : x));
  return (
    <div className="pp-classes">
      <div className="pp-hint"><Icon name="check" size={16} color="var(--eucalyptus)" /> Set your weekly schedule and seat limits. Clients see live spots left and can join a waitlist when a class is full.</div>
      {rows.map((c, i) => (
        <div className="pp-class-row" key={i}>
          <div className="pp-class-preview"><ClassCard {...c} spotsLeft={c.capacity - c.booked} /></div>
          <div className="pp-class-ctrls">
            <span className="pp-class-lbl">Seat limit</span>
            <div className="pp-stepper">
              <button onClick={()=>setCap(i,-1)} aria-label="Fewer seats">&minus;</button>
              <b>{c.capacity}</b>
              <button onClick={()=>setCap(i,1)} aria-label="More seats">+</button>
            </div>
            <span className="pp-booked">{c.booked} booked · {c.capacity - c.booked} left</span>
          </div>
        </div>
      ))}
      <Button variant="secondary">+ Add class</Button>
    </div>
  );
}

function Placeholder({ label }) {
  return <div className="pp-placeholder"><Icon name="calendar" size={30} color="var(--cocoa-40)" /><p>{label} — coming in this panel.</p></div>;
}

function ProviderPanel() {
  const [tab, setTab] = React.useState("page");
  const active = NAV.find(n=>n.key===tab);
  return (
    <div className="pp-shell">
      <aside className="pp-side">
        <div className="pp-brand"><span className="pp-brand-mark">Kreol</span> <span className="pp-brand-word">Spa</span></div>
        <div className="pp-brand-sub">Business panel</div>
        <nav className="pp-nav">
          {NAV.map(n => (
            <button key={n.key} className={"pp-nav-item" + (tab===n.key ? " is-active" : "")} onClick={()=>setTab(n.key)}>
              <Icon name={n.icon} size={18} color={tab===n.key ? "var(--clay)" : "var(--cocoa-60)"} /> {n.label}
            </button>
          ))}
        </nav>
        <a className="pp-viewpublic" href="../venue/index.html"><Icon name="arrowRight" size={16} color="var(--cocoa-60)" /> View public page</a>
      </aside>

      <main className="pp-main">
        <header className="pp-top">
          <div>
            <h1 className="pp-title">{active.label}</h1>
            <p className="pp-crumb">book.sey.la · Kreol Spa</p>
          </div>
          <div className="pp-top-cta">
            <Badge tone="botanical">Live</Badge>
            <Button size="sm">+ New booking</Button>
          </div>
        </header>
        <div className="pp-content">
          {tab === "page" && <PageEditor />}
          {tab === "dashboard" && <Dashboard />}
          {tab === "classes" && <ClassesView />}
          {tab !== "page" && tab !== "dashboard" && tab !== "classes" && <Placeholder label={active.label} />}
        </div>
      </main>
    </div>
  );
}

export default ProviderPanel;
