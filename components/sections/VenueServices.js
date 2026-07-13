"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { BookNow } from "@/components/booking/BookNow";
import { scr } from "@/lib/money";
// VenueServices — the core: grouped treatment menu with prices + book buttons.



function VenueServices({ studio }) {
  // Tabbed groups built from the studio's real services. No demo fallback — a
  // studio with no services yet shows an honest empty state, never fake ones.
  const groups = React.useMemo(() => {
    if (!(studio && studio.services && studio.services.length)) return [];
    const map = new Map();
    for (const it of studio.services) {
      const g = it.group || "Treatments";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push({ id: it.id, name: it.name, dur: it.dur, price: it.price, desc: it.desc, durationMin: it.durationMin, priceEur: it.priceEur });
    }
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }, [studio]);
  const [active, setActive] = React.useState(groups[0] ? groups[0].name : "");
  const group = groups.find(g => g.name === active) || groups[0];
  const [selected, setSelected] = React.useState(null);
  const studioId = studio && studio.id;
  const unclaimed = !!(studio && studio.unclaimed);
  const claimHref = studio && studio.slug ? `/claim/${studio.slug}` : "/for-studios";
  return (
    <section className="vn-section" id="services">
      <div className="sey-container">
        {unclaimed && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: "var(--cocoa)", fontSize: "var(--text-sm)" }}>
              <b>This studio hasn’t joined sey.la yet</b> — online booking isn’t available. Is it yours?
            </span>
            <Button size="sm" as="a" href={claimHref}>Claim this studio</Button>
          </div>
        )}
        <div className="vn-sec-head">
          <div>
            <div className="sey-eyebrow vn-eyebrow">The menu</div>
            <h2 className="vn-sec-title">Choose your <em className="sey-accent-italic">treatment</em></h2>
          </div>
          {groups.length > 1 && (
            <div className="vn-tabs" role="tablist" aria-label="Service groups">
              {groups.map(g => (
                <button key={g.name} role="tab" aria-selected={active===g.name}
                  className={"vn-tab" + (active===g.name ? " is-active" : "")}
                  onClick={() => setActive(g.name)}>{g.name}</button>
              ))}
            </div>
          )}
        </div>
        {!group ? (
          <p style={{ color: "var(--text-muted)", margin: "8px 0 0" }}>
            {unclaimed ? "This studio hasn’t added its treatment menu yet." : "No services listed yet — check back soon."}
          </p>
        ) : (
        <ul className="vn-menu">
          {group.items.map(s => (
            <li className="vn-srv" key={s.name}>
              <div className="vn-srv-main">
                <div className="vn-srv-top">
                  <h3>{s.name}</h3>
                  {s.tag && <Badge tone="brand">{s.tag}</Badge>}
                </div>
                {s.desc && <p>{s.desc}</p>}
                <span className="vn-srv-dur"><Icon name="clock" size={14} color="var(--cocoa-40)" /> {s.dur}</span>
              </div>
              <div className="vn-srv-end">
                <span className="vn-srv-price">{s.price}</span>
                {unclaimed
                  ? <Button size="sm" variant="secondary" as="a" href={claimHref}>Claim to book</Button>
                  : <Button size="sm" variant="secondary" onClick={() => setSelected(s)}>Book</Button>}
              </div>
            </li>
          ))}
        </ul>
        )}
        {studio && Array.isArray(studio.packages) && studio.packages.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="sey-eyebrow vn-eyebrow">Save more</div>
            <h2 className="vn-sec-title" style={{ marginBottom: 18 }}>Memberships &amp; <em className="sey-accent-italic">packages</em></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {studio.packages.map((p) => (
                <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: "var(--text-body)", color: "var(--cocoa)" }}>{p.name}</h3>
                    <Badge tone="brand">{p.kind === "membership" ? "Membership" : "Package"}</Badge>
                  </div>
                  {p.description && <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{p.description}</p>}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                    {p.priceEur != null && <span className="vn-srv-price">{scr(p.priceEur)}{p.kind === "membership" ? " / mo" : ""}</span>}
                    {p.credits != null && <span style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)" }}>{p.credits} visits</span>}
                  </div>
                  <span style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)", marginTop: 2 }}>Ask in-studio to redeem</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {selected && !unclaimed && (
          <BookNow studioId={studioId} service={selected} team={studio && studio.team} hours={studio && studio.hours} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}

export default VenueServices;
