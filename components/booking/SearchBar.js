"use client";
import React from "react";
import { Icon } from "../brand/Icon";
import { Button } from "../core/Button";

/**
 * SearchBar — treatment/studio + location search. Submitting calls
 * onSubmit({ q, loc }) with the trimmed values; the caller decides whether to
 * navigate to /search or filter in place. No date field: availability isn't
 * searchable yet, so we don't offer a filter we can't honour.
 */
export function SearchBar({
  treatmentPlaceholder = "Treatment or studio",
  locationPlaceholder = "Anywhere on Mahé",
  cta = "Search",
  initialQ = "",
  initialLoc = "",
  onSubmit,
  style = {},
  ...rest
}) {
  const [q, setQ] = React.useState(initialQ);
  const [loc, setLoc] = React.useState(initialLoc);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit({ q: q.trim(), loc: loc.trim() });
      }}
      className="sey-searchbar"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "8px",
        background: "var(--surface)",
        borderRadius: "var(--radius-pill)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--line)",
        padding: "8px",
        ...style,
      }}
      {...rest}
    >
      <label className="sey-search-field">
        <Icon name="search" size={19} color="var(--cocoa-40)" />
        <input type="text" placeholder={treatmentPlaceholder} aria-label="Treatment or studio" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <span className="sey-search-divider" aria-hidden="true" />
      <label className="sey-search-field">
        <Icon name="pin" size={19} color="var(--cocoa-40)" />
        <input type="text" placeholder={locationPlaceholder} aria-label="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
      </label>
      <Button type="submit" size="md" style={{ flex: "none" }}>
        {cta}
      </Button>

      <style dangerouslySetInnerHTML={{ __html: `
        .sey-search-field {
          flex: 1; min-width: 0;
          display: flex; align-items: center; gap: 10px;
          padding: 6px 18px;
          border-radius: var(--radius-pill);
          transition: background var(--dur-fast) var(--ease-soft);
        }
        .sey-search-field:focus-within { background: var(--blush); }
        .sey-search-field input {
          flex: 1; min-width: 0;
          border: none; outline: none; background: transparent;
          font-family: var(--font-body); font-size: var(--text-body);
          color: var(--cocoa); padding: 8px 0;
        }
        .sey-search-field input::placeholder { color: var(--cocoa-40); }
        .sey-search-divider { width: 1px; background: var(--line); margin: 8px 0; flex: none; }
        @media (max-width: 640px) {
          .sey-searchbar { flex-direction: column; border-radius: var(--radius-lg); padding: 10px; }
          .sey-search-field { border: 1px solid var(--line); }
          .sey-search-divider { display: none; }
          .sey-searchbar > button { width: 100%; }
        }
      ` }} />
    </form>
  );
}
