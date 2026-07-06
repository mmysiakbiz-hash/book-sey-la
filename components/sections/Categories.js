"use client";
import React from "react";
import { CategoryTile } from "@/components/booking/CategoryTile";
import { SectionHeader } from "@/components/core/SectionHeader";
// Categories — the service categories with line icons. Universal, single grid.



const CATEGORIES = [
  { icon: "hair", label: "Hair" },
  { icon: "barber", label: "Barber" },
  { icon: "nails", label: "Nails" },
  { icon: "brows", label: "Brows & lashes" },
  { icon: "spa", label: "Spa & massage" },
  { icon: "skin", label: "Skin & facial" },
  { icon: "makeup", label: "Makeup" },
  { icon: "waxing", label: "Waxing" },
  { icon: "tattoo", label: "Tattoo" },
  { icon: "piercing", label: "Piercing" },
  { icon: "fitness", label: "Fitness & yoga" },
  { icon: "trainer", label: "Personal trainer" },
];

function Categories({ studios }) {
  // Real per-category studio counts from the live list (null = don't show a number).
  const counts = React.useMemo(() => {
    const m = {};
    (studios || []).forEach((s) => { if (s && s.category) m[s.category] = (m[s.category] || 0) + 1; });
    return m;
  }, [studios]);
  return (
    <section className="lp-section" id="categories">
      <div className="sey-container">
        <SectionHeader
          eyebrow="Book by what you need"
          title="Every kind of care"
          intro="From a beachside massage to a sharp fade before dinner — browse verified studios by service."
        />
        <div className="lp-cats">
          {CATEGORIES.map((c) => {
            const n = counts[c.label] || 0;
            return (
              <CategoryTile
                key={c.label}
                icon={c.icon}
                label={c.label}
                count={n > 0 ? n : null}
                as="a"
                href={`/search?cat=${encodeURIComponent(c.label)}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
