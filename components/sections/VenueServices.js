"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { Badge } from "@/components/core/Badge";
import { BookNow } from "@/components/booking/BookNow";
// VenueServices — the core: grouped treatment menu with prices + book buttons.



const GROUPS = [
  { name: "Massage", items: [
    { name: "Coconut & Frangipani signature", desc: "Warm oil full-body massage with island botanicals.", dur: "60 min", price: "€55", tag: "Most booked" },
    { name: "Deep-tissue recovery", desc: "Firmer pressure for shoulders, back and legs.", dur: "60 min", price: "€58" },
    { name: "Hot stone therapy", desc: "Volcanic stones to melt deep tension.", dur: "75 min", price: "€65" },
  ]},
  { name: "Face", items: [
    { name: "Signature island facial", desc: "Cleanse, clay mask and lymphatic massage.", dur: "50 min", price: "€48" },
    { name: "Express glow facial", desc: "A quick reset before dinner.", dur: "30 min", price: "€32" },
  ]},
  { name: "Body & rituals", items: [
    { name: "Sea salt & clay body wrap", desc: "Exfoliate, wrap and hydrate.", dur: "60 min", price: "€52" },
    { name: "Couples' frangipani ritual", desc: "Side-by-side massage for two.", dur: "60 min", price: "€105", tag: "For two" },
  ]},
];

function VenueServices({ studio }) {
  // Build tabbed groups from live services when available; demo fallback otherwise.
  const groups = React.useMemo(() => {
    if (studio && studio.services && studio.services.length) {
      const map = new Map();
      for (const it of studio.services) {
        const g = it.group || "Treatments";
        if (!map.has(g)) map.set(g, []);
        map.get(g).push({ id: it.id, name: it.name, dur: it.dur, price: it.price, desc: it.desc, durationMin: it.durationMin, priceEur: it.priceEur });
      }
      return [...map.entries()].map(([name, items]) => ({ name, items }));
    }
    return GROUPS;
  }, [studio]);
  const [active, setActive] = React.useState(groups[0].name);
  const group = groups.find(g => g.name === active) || groups[0];
  const [selected, setSelected] = React.useState(null);
  const studioId = studio && studio.id;
  return (
    <section className="vn-section" id="services">
      <div className="sey-container">
        <div className="vn-sec-head">
          <div>
            <div className="sey-eyebrow vn-eyebrow">The menu</div>
            <h2 className="vn-sec-title">Choose your <em className="sey-accent-italic">treatment</em></h2>
          </div>
          <div className="vn-tabs" role="tablist" aria-label="Service groups">
            {groups.map(g => (
              <button key={g.name} role="tab" aria-selected={active===g.name}
                className={"vn-tab" + (active===g.name ? " is-active" : "")}
                onClick={() => setActive(g.name)}>{g.name}</button>
            ))}
          </div>
        </div>
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
                <Button size="sm" variant="secondary" onClick={() => setSelected(s)}>Book</Button>
              </div>
            </li>
          ))}
        </ul>
        {selected && (
          <BookNow studioId={studioId} service={selected} team={studio && studio.team} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}

export default VenueServices;
