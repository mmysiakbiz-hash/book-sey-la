"use client";
import React from "react";

// BlockCalendar — pick a day, or a start + end day for a range, and block it
// (day off / holiday), Booksy/Airbnb style. Full-day blocks; an optional
// time window applies when a single day is selected (a mid-day break).

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);

export function BlockCalendar({ blocked = [], onAdd, onDone }) {
  const now = new Date();
  const [view, setView] = React.useState({ y: now.getFullYear(), m: now.getMonth() });
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);
  const [reason, setReason] = React.useState("");
  const [times, setTimes] = React.useState({ from: "", to: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const todayStr = ymd(now);

  const blockedDays = React.useMemo(() => {
    const s = new Set();
    (blocked || []).forEach((t) => {
      if (!t.start) return;
      const a = new Date(t.start); a.setHours(0, 0, 0, 0);
      const b = t.end ? new Date(t.end) : new Date(a.getTime() + 86400000);
      for (let d = new Date(a); d < b; d.setDate(d.getDate() + 1)) s.add(ymd(d));
    });
    return s;
  }, [blocked]);

  const first = new Date(view.y, view.m, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const shiftMonth = (delta) => setView((v) => { const d = new Date(v.y, v.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  function clickDay(d) {
    const s = ymd(d);
    if (s < todayStr) return; // no blocking the past
    if (!start || (start && end)) { setStart(s); setEnd(null); return; }
    if (s < start) { setStart(s); setEnd(null); return; }
    if (s === start) { setEnd(null); return; }
    setEnd(s);
  }
  const isSel = (d) => { const s = ymd(d); return start && end ? s >= start && s <= end : s === start; };
  const selCount = start && end ? dayDiff(start, end) + 1 : start ? 1 : 0;
  const singleDay = start && !end;

  async function block() {
    if (!start) { setErr("Tap a day — or a start day then an end day for a range."); return; }
    setErr(""); setBusy(true);
    const s = start, e = end || start;
    let startISO, endISO;
    if (singleDay && times.from && times.to) {
      startISO = new Date(`${s}T${times.from}:00+04:00`).toISOString();
      endISO = new Date(`${s}T${times.to}:00+04:00`).toISOString();
    } else {
      startISO = new Date(`${s}T00:00:00+04:00`).toISOString();
      const endDate = new Date(`${e}T00:00:00+04:00`); endDate.setDate(endDate.getDate() + 1);
      endISO = endDate.toISOString();
    }
    const r = await onAdd({ startISO, endISO, reason });
    setBusy(false);
    if (r && r.error) { setErr("Couldn't block: " + r.error); return; }
    setStart(null); setEnd(null); setReason(""); setTimes({ from: "", to: "" });
    onDone();
  }

  const cell = { border: "none", background: "none", cursor: "pointer", borderRadius: "var(--radius-md)", padding: "9px 0", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--cocoa)", position: "relative" };
  const inp = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const primaryBtn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "11px 20px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };
  const navBtn = { border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, width: 32, height: 32, cursor: "pointer", color: "var(--cocoa)", fontSize: 16, lineHeight: 1 };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 16, marginBottom: 18, maxWidth: 420 }}>
      <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 4 }}>Block time (day off / holiday)</div>
      <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: "0 0 12px" }}>Tap a day to block it, or tap a start day then an end day for a range.</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button style={navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
        <div style={{ fontWeight: 600, color: "var(--cocoa)" }}>{MONTHS[view.m]} {view.y}</div>
        <button style={navBtn} onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center" }}>
        {DOW.map((d) => <div key={d} style={{ fontSize: "var(--text-xs)", color: "var(--text-caption)", padding: "4px 0", fontWeight: 600 }}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={"e" + i} />;
          const s = ymd(d);
          const past = s < todayStr;
          const sel = isSel(d);
          const isBlocked = blockedDays.has(s);
          return (
            <button key={s} onClick={() => clickDay(d)} disabled={past} style={{
              ...cell,
              cursor: past ? "default" : "pointer",
              color: past ? "var(--cocoa-40)" : sel ? "var(--surface)" : "var(--cocoa)",
              background: sel ? "var(--clay)" : "transparent",
              opacity: past ? 0.5 : 1,
              fontWeight: s === todayStr ? 700 : 400,
              textDecoration: isBlocked && !sel ? "line-through" : "none",
            }} title={isBlocked ? "Already blocked" : ""}>
              {d.getDate()}
              {isBlocked && !sel && <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--clay)" }} />}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {singleDay && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-caption)", flex: "none" }}>Whole day, or</span>
            <input style={{ ...inp, flex: 1 }} type="time" value={times.from} onChange={(e) => setTimes((t) => ({ ...t, from: e.target.value }))} />
            <input style={{ ...inp, flex: 1 }} type="time" value={times.to} onChange={(e) => setTimes((t) => ({ ...t, to: e.target.value }))} />
          </div>
        )}
        <input style={inp} placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button style={primaryBtn} onClick={block} disabled={busy || !start}>
            {busy ? "Blocking…" : selCount > 1 ? `Block ${selCount} days` : "Block this day"}
          </button>
          {(start) && <button onClick={() => { setStart(null); setEnd(null); }} style={{ border: "none", background: "none", color: "var(--cocoa-60)", cursor: "pointer", fontSize: "var(--text-sm)" }}>Clear</button>}
          {err && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</span>}
        </div>
      </div>
    </div>
  );
}
