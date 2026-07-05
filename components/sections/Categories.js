"use client";
import React from "react";
import { CategoryTile } from "@/components/booking/CategoryTile";
import { SectionHeader } from "@/components/core/SectionHeader";
// Categories — the service categories with line icons. Universal, single grid.



const CATEGORIES = [
  { icon: "hair", label: "Hair", count: 32 },
  { icon: "barber", label: "Barber", count: 12 },
  { icon: "nails", label: "Nails", count: 21 },
  { icon: "brows", label: "Brows & lashes", count: 18 },
  { icon: "spa", label: "Spa & massage", count: 24 },
  { icon: "skin", label: "Skin & facial", count: 16 },
  { icon: "makeup", label: "Makeup", count: 9 },
  { icon: "waxing", label: "Waxing", count: 11 },
  { icon: "tattoo", label: "Tattoo", count: 8 },
  { icon: "piercing", label: "Piercing", count: 6 },
  { icon: "fitness", label: "Fitness & yoga", count: 14 },
  { icon: "trainer", label: "Personal trainer", count: 10 },
];

function Categories() {
  return (
    <section className="lp-section" id="categories">
      <div className="sey-container">
        <SectionHeader
          eyebrow="Book by what you need"
          title="Every kind of care"
          intro="From a beachside massage to a sharp fade before dinner — browse verified studios by service."
        />
        <div className="lp-cats">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c.label} icon={c.icon} label={c.label} count={c.count} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
