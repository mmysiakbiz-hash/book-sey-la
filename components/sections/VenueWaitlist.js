"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { joinWaitlist } from "@/lib/waitlist";

// "Can't find a time? Join the waitlist." Client-facing, RLS waitlist_join.
export default function VenueWaitlist({ studioId }) {
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ name: "", email: "", phone: "", note: "" });
  const [state, setState] = React.useState("idle"); // idle | sending | done | error
  if (!studioId) return null;
  const set = (p) => setF((v) => ({ ...v, ...p }));
  const inp = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };

  async function join() {
    if (!f.email.trim()) return;
    setState("sending");
    const r = await joinWaitlist(studioId, f);
    setState(r && r.ok ? "done" : "error");
  }

  return (
    <section className="vn-section" id="waitlist">
      <div className="sey-container" style={{ maxWidth: 620 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          {state === "done" ? (
            <p style={{ margin: 0, color: "var(--cocoa)" }}>You're on the waitlist — we'll be in touch if a slot opens.</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "var(--cocoa)", fontWeight: 600 }}>Can't find a time? Join the waitlist.</span>
                <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Join waitlist"}</Button>
              </div>
              {open && (
                <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                  <input style={inp} placeholder="Your name" value={f.name} onChange={(e) => set({ name: e.target.value })} />
                  <input style={inp} type="email" placeholder="you@email.com" value={f.email} onChange={(e) => set({ email: e.target.value })} />
                  <input style={inp} placeholder="Phone (optional)" value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
                  <input style={inp} placeholder="Preferred days / times (optional)" value={f.note} onChange={(e) => set({ note: e.target.value })} />
                  <Button size="md" onClick={join} disabled={state === "sending" || !f.email.trim()}>{state === "sending" ? "Joining…" : "Join the waitlist"}</Button>
                  {state === "error" && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>Couldn't join — try again.</span>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
