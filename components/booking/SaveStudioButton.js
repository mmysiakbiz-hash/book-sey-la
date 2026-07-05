"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";
import { useUser } from "@/lib/useUser";
import { getFavouriteIds, toggleFavourite } from "@/lib/favourites";

// Heart toggle to save a studio to favourites. Login-gated (RLS binds to the user).
export function SaveStudioButton({ studioId }) {
  const { user } = useUser();
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let ok = true;
    if (user && studioId) getFavouriteIds().then((ids) => { if (ok) setSaved(ids.includes(studioId)); });
    else setSaved(false);
    return () => { ok = false; };
  }, [user, studioId]);

  async function onClick() {
    if (!user) { window.location.href = "/login"; return; }
    if (!studioId || busy) return;
    setBusy(true);
    const prev = saved;
    setSaved(!prev); // optimistic
    const res = await toggleFavourite(studioId);
    setSaved(res.error ? prev : res.saved);
    setBusy(false);
  }

  return (
    <button onClick={onClick} disabled={busy} aria-pressed={saved} aria-label={saved ? "Saved to favourites" : "Save to favourites"}
      style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-pill)", padding: "7px 14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--cocoa)", font: "inherit", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--text-sm)" }}>
      <Icon name="heart" size={16} color={saved ? "var(--clay)" : "var(--cocoa-40)"} fill={saved ? "var(--clay)" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
