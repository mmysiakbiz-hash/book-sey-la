"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";

/**
 * Select — a design-matched dropdown replacing the native <select>, whose open
 * list can't be styled consistently across browsers. Closes on outside-click or
 * Escape. options: array of strings, or { value, label }.
 */
export function Select({ value, onChange, options = [], ariaLabel, align = "left", style = {}, buttonStyle = {} }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = opts.find((o) => o.value === value) || opts[0];

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="sey-select" ref={ref} style={{ position: "relative", ...style }}>
      <button
        type="button"
        className="sey-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        style={buttonStyle}
      >
        <span className="sey-select-value">{current ? current.label : ""}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-soft)" }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className={"sey-select-list" + (align === "right" ? " sey-select-list--right" : "")} role="listbox" aria-label={ariaLabel}>
          {opts.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={"sey-select-opt" + (o.value === value ? " is-sel" : "")}
              onClick={() => { onChange && onChange(o.value); setOpen(false); }}
            >
              <span>{o.label}</span>
              {o.value === value && <Icon name="check" size={15} color="var(--clay)" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
