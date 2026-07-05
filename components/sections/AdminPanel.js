"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
// AdminPanel — internal operations dashboard for book.sey.la.



const STATS = [
  { n: "182", l: "active studios", d: "+6 this week" },
  { n: "164", l: "paid subscriptions", d: "90% of studios" },
  { n: "12,418", l: "bookings this month", d: "+18% MoM" },
  { n: "€3,116", l: "MRR", d: "€19 × 164" },
];

const BUSINESSES = [
  { name: "Kreol Spa", island: "Mahé", cat: "Spa & massage", plan: "Paid", status: "Live" },
  { name: "Palm & Blade", island: "Mahé", cat: "Barber", plan: "Paid", status: "Live" },
  { name: "Frangipani Nails", island: "Praslin", cat: "Nails", plan: "Trial", status: "Live" },
  { name: "Island Glow", island: "La Digue", cat: "Brows & lashes", plan: "Trial", status: "Review" },
  { name: "North Shore Grooming", island: "Mahé", cat: "Barber", plan: "Paid", status: "Live" },
  { name: "Coco Makeup Bar", island: "Mahé", cat: "Makeup", plan: "Paid", status: "Live" },
];

const ACTIVITY = [
  { t: "New studio signed up", s: "Anse Fit · Fitness & yoga · Mahé", w: "12 min ago", ic: "sparkle" },
  { t: "Subscription started", s: "Coco Makeup Bar · €19/mo", w: "1 h ago", ic: "heart" },
  { t: "Verification requested", s: "Island Glow · La Digue", w: "3 h ago", ic: "shield" },
  { t: "Refund processed", s: "Zen Shore · €19", w: "yesterday", ic: "check" },
];

function planTone(p){ return p==="Paid" ? "confirmed" : "brand"; }
function statusTone(s){ return s==="Live" ? "botanical" : s==="Review" ? "brand" : "neutral"; }

function AdminPanel() {
  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <div className="ad-brand">sey.la <span>admin</span></div>
        <nav className="ad-nav">
          {[["Overview","sparkle",true],["Studios","pin",false],["Bookings","calendar",false],["Payments","heart",false],["Reviews","star",false],["Settings","shield",false]].map(([l,ic,on])=>(
            <button key={l} className={"ad-nav-item"+(on?" is-active":"")}><Icon name={ic} size={17} color={on?"var(--brass)":"rgba(245,234,224,0.55)"} /> {l}</button>
          ))}
        </nav>
        <div className="ad-env">Internal · book.sey.la</div>
      </aside>

      <main className="ad-main">
        <header className="ad-top">
          <div><h1 className="ad-title">Overview</h1><p className="ad-sub">Operations across Mahé, Praslin &amp; La Digue</p></div>
          <div className="ad-top-cta"><Badge tone="confirmed">All systems live</Badge><Button size="sm">Export</Button></div>
        </header>

        <div className="ad-content">
          <div className="ad-stats">
            {STATS.map(s=>(
              <div className="ad-stat" key={s.l}><b>{s.n}</b><span>{s.l}</span><em>{s.d}</em></div>
            ))}
          </div>

          <div className="ad-grid">
            <section className="ad-card">
              <div className="ad-card-head"><h2>Studios</h2><a href="#">View all →</a></div>
              <table className="ad-table">
                <thead><tr><th>Name</th><th>Island</th><th>Category</th><th>Plan</th><th>Status</th></tr></thead>
                <tbody>
                  {BUSINESSES.map(b=>(
                    <tr key={b.name}>
                      <td className="ad-strong">{b.name}</td>
                      <td>{b.island}</td>
                      <td>{b.cat}</td>
                      <td><Badge tone={planTone(b.plan)}>{b.plan}</Badge></td>
                      <td><Badge tone={statusTone(b.status)}>{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="ad-card">
              <div className="ad-card-head"><h2>Recent activity</h2></div>
              <ul className="ad-activity">
                {ACTIVITY.map((a,i)=>(
                  <li key={i}>
                    <span className="ad-act-ic"><Icon name={a.ic} size={16} color="var(--clay)" /></span>
                    <span className="ad-act-body"><b>{a.t}</b><span>{a.s}</span></span>
                    <span className="ad-act-when">{a.w}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
