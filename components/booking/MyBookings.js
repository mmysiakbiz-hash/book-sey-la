"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { cancelMyBooking, rescheduleMyBooking } from "@/lib/bookings";
import { scr } from "@/lib/money";

function fmtWhen(startsAt) {
  if (!startsAt) return "";
  const d = new Date(startsAt);
  if (isNaN(d)) return "";
  return d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" });
}

// The instant as a datetime-local value (YYYY-MM-DDTHH:mm) in Mahé time (UTC+4).
function toMaheInput(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d)) return "";
  return new Date(d.getTime() + 4 * 3600000).toISOString().slice(0, 16);
}

const CARD = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "13px 15px" };
const isActive = (b, now) => b.status !== "cancelled" && (!b.startsAt || new Date(b.startsAt).getTime() >= now - 3600000);

function Row({ b, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(null); // null | "reschedule"
  const [when, setWhen] = React.useState(toMaheInput(b.startsAt));
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const active = isActive(b, Date.now());
  const title = b.serviceName || "Appointment";
  const sub = [b.studioName, b.staffName].filter(Boolean).join(" · ");

  async function doCancel() {
    if (!window.confirm("Cancel this booking? Free up to 12 hours before your visit.")) return;
    setBusy(true); setErr("");
    const r = await cancelMyBooking(b.id);
    setBusy(false);
    if (r.error) { setErr("Couldn't cancel — please try again."); return; }
    onChange({ ...b, status: "cancelled" });
  }
  async function doReschedule() {
    if (!when) return;
    setBusy(true); setErr("");
    const startsAt = new Date(`${when}:00+04:00`).toISOString();
    const r = await rescheduleMyBooking(b.id, b.studioId, startsAt, b.durationMin, b.staffId);
    setBusy(false);
    if (r.error) {
      setErr(r.error === "outside_hours" ? "That's outside the studio's opening hours." : r.error === "studio_unavailable" ? "The studio has blocked that time." : "Couldn't reschedule — try another time.");
      return;
    }
    onChange({ ...b, startsAt }); setMode(null); setOpen(false);
  }

  const statusColor = b.status === "cancelled" ? "var(--clay)" : b.status === "completed" ? "var(--text-muted)" : "var(--confirmed)";

  return (
    <div style={CARD}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "var(--cocoa)" }}>{title}</div>
          {sub && <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginTop: 2 }}>{sub}</div>}
          <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginTop: 2 }}>{fmtWhen(b.startsAt)}</div>
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          {b.priceEur != null && <div style={{ fontWeight: 700 }}>{scr(b.priceEur)}</div>}
          <div style={{ color: statusColor, fontWeight: 600, fontSize: "var(--text-sm)", marginTop: 2, textTransform: "capitalize" }}>{b.status}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {active && <Button size="sm" variant="secondary" onClick={() => { setOpen((v) => !v); setMode("reschedule"); }}>Reschedule</Button>}
        {active && <Button size="sm" variant="ghost" onClick={doCancel} disabled={busy}>Cancel</Button>}
        {b.studioSlug && <Button size="sm" variant="ghost" as="a" href={`/studio/${b.studioSlug}#services`}>Book again</Button>}
      </div>

      {open && mode === "reschedule" && active && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", color: "var(--cocoa)", background: "var(--surface)" }}
          />
          <Button size="sm" onClick={doReschedule} disabled={busy}>{busy ? "Saving…" : "Save new time"}</Button>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-caption)" }}>Island time (UTC+4)</span>
        </div>
      )}
      {err && <div style={{ color: "var(--clay)", fontSize: "var(--text-sm)", marginTop: 8 }}>{err}</div>}
    </div>
  );
}

export function MyBookings({ bookings }) {
  const [list, setList] = React.useState(bookings || []);
  const now = Date.now();
  const upcoming = list.filter((b) => isActive(b, now));
  const past = list.filter((b) => !isActive(b, now));
  const update = (nb) => setList((l) => l.map((x) => (x.id === nb.id ? nb : x)));

  if (!list.length) return null;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {upcoming.map((b) => <Row key={b.id} b={b} onChange={update} />)}
      {past.length > 0 && (
        <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 8 }}>Past &amp; cancelled</div>
      )}
      {past.map((b) => <Row key={b.id} b={b} onChange={update} />)}
    </div>
  );
}
