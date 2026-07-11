"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { scr } from "@/lib/money";

// Public classes for a studio — live spots + inline join (POST /api/class-book).
export default function VenueClasses({ classes }) {
  const [list, setList] = React.useState(classes || []);
  if (!list.length) return null;

  return (
    <section className="vn-section" id="classes">
      <div className="sey-container">
        <div className="sey-eyebrow vn-eyebrow">Classes</div>
        <h2 className="vn-sec-title">Join a <em className="sey-accent-italic">class.</em></h2>
        <div style={{ display: "grid", gap: 12, marginTop: 20, maxWidth: 620 }}>
          {list.map((c) => <ClassCard key={c.id} c={c} onJoined={(spotsLeft) => setList((v) => v.map((x) => x.id === c.id ? { ...x, spotsLeft } : x))} />)}
        </div>
      </div>
    </section>
  );
}

function ClassCard({ c, onJoined }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState("idle"); // idle | sending | done | waitlisted | error
  const [err, setErr] = React.useState("");

  const start = c.startsAt ? new Date(c.startsAt) : null;
  const when = start ? start.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : "";
  const full = c.spotsLeft != null && c.spotsLeft <= 0;

  async function join() {
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/class-book", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: c.id, name, email }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) { setState(j.waitlisted ? "waitlisted" : "done"); onJoined(j.spotsLeft); }
      else if (j.error === "already_joined") { setState("done"); }
      else { setState("error"); setErr(j.error || "error"); }
    } catch (e) { setState("error"); setErr("network_error"); }
  }

  const box = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px" };
  const inp = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };

  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, color: "var(--cocoa)" }}>{c.name}</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", marginTop: 2 }}>
            {when}{c.staff ? ` · ${c.staff}` : ""}{c.priceEur != null ? ` · ${scr(c.priceEur)}` : ""}
          </div>
          {c.description && <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "8px 0 0" }}>{c.description}</p>}
          {c.spotsLeft != null && (
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginTop: 8, color: full ? "var(--clay)" : "var(--eucalyptus)" }}>
              {full ? "Fully booked · join the waitlist" : `${c.spotsLeft} spot${c.spotsLeft === 1 ? "" : "s"} left`}
            </div>
          )}
        </div>
        {state === "done" ? (
          <span style={{ color: "var(--eucalyptus)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={16} color="var(--eucalyptus)" /> Booked</span>
        ) : state === "waitlisted" ? (
          <span style={{ color: "var(--clay)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={16} color="var(--clay)" /> On waitlist</span>
        ) : (
          <Button size="sm" variant={full ? "secondary" : "primary"} onClick={() => setOpen((v) => !v)}>{open ? "Close" : (full ? "Join waitlist" : "Join")}</Button>
        )}
      </div>

      {open && state !== "done" && state !== "waitlisted" && (
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {full && <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: 0 }}>This class is full. Join the waitlist and we'll email you if a spot opens up.</p>}
          <input style={inp} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={inp} type="email" inputMode="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") join(); }} />
          <Button size="sm" onClick={join} disabled={state === "sending" || !email.trim()}>{state === "sending" ? (full ? "Joining…" : "Booking…") : (full ? "Join waitlist" : "Confirm spot")}</Button>
          {state === "error" && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>Couldn't book ({err}). Try again.</span>}
        </div>
      )}
    </div>
  );
}
