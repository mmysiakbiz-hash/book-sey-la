"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { useUser } from "@/lib/useUser";
import { createBooking } from "@/lib/bookings";

const MTZ = "Indian/Mahe";
const fmtDay = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: MTZ });
const hhmmToMin = (s) => { const m = /(\d{1,2}):(\d{2})/.exec(s || ""); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
const minToHHMM = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// Build the bookable time slots for a given day from the studio's real opening
// hours (array of [weekdayLabel, "9:00 – 18:00"]); past times on today are dropped.
// The last slot must leave room for the full service duration before closing.
function slotsForDay(day, hours, durationMin = 30) {
  if (!Array.isArray(hours) || !hours.length) return [];
  const label = day.toLocaleDateString("en-GB", { weekday: "short", timeZone: MTZ });
  const row = hours.find((h) => Array.isArray(h) && h[0] === label);
  if (!row) return []; // closed that day
  const parts = String(row[1]).split(/[–-]/);
  const open = hhmmToMin(parts[0]);
  const close = hhmmToMin(parts[1]);
  if (open == null || close == null || close <= open) return [];
  const now = new Date();
  const todayKey = now.toLocaleDateString("en-CA", { timeZone: MTZ });
  const isToday = day.toLocaleDateString("en-CA", { timeZone: MTZ }) === todayKey;
  const nowMin = isToday ? hhmmToMin(now.toLocaleTimeString("en-GB", { timeZone: MTZ, hour: "2-digit", minute: "2-digit" })) : -1;
  const dur = Math.max(15, durationMin || 30);
  const out = [];
  for (let m = open; m + dur <= close; m += 30) { if (m > nowMin) out.push(minToHHMM(m)); }
  return out;
}

// BookNow — a compact date/time picker that writes a real booking to Supabase.
// Login-gated (bookings RLS requires an authenticated customer).
export function BookNow({ studioId, service, team = [], hours = [], onClose }) {
  const { user, loading } = useUser();
  const [staffId, setStaffId] = React.useState("any");
  // Only offer staff who perform this service (empty services list = does everything).
  const eligibleTeam = React.useMemo(
    () => (team || []).filter((p) => !(p.services && p.services.length) || p.services.includes(service.name)),
    [team, service.name]
  );
  const days = React.useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return [0, 1, 2, 3, 4].map((i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);
  const [dayIdx, setDayIdx] = React.useState(0);
  const [time, setTime] = React.useState(null);
  const [phone, setPhone] = React.useState("");
  const [state, setState] = React.useState("idle"); // idle | booking | done | error
  const [msg, setMsg] = React.useState("");

  // Real slots for the selected day, from the studio's opening hours.
  const slots = React.useMemo(() => slotsForDay(days[dayIdx], hours, service.durationMin || 60), [days, dayIdx, hours, service.durationMin]);
  // Keep the picked time valid as the day (and thus slot set) changes.
  React.useEffect(() => { setTime((t) => (t && slots.includes(t) ? t : (slots[0] || null))); }, [slots]);

  // Prefill the phone number from the profile if we have one.
  React.useEffect(() => {
    const p = user && user.user_metadata && user.user_metadata.phone;
    if (p) setPhone(String(p));
  }, [user]);

  async function book() {
    if (!time) return;
    setState("booking");
    // Interpret the picked day + time as MAHÉ local time (UTC+4, no DST) — not the
    // visitor's browser timezone. Otherwise a client abroad books the wrong slot.
    const d = days[dayIdx];
    const dateStr = d.toLocaleDateString("en-CA", { timeZone: MTZ }); // YYYY-MM-DD in Mahé
    const mahe = `${dateStr}T${time}:00+04:00`;
    const res = await createBooking({
      studioId,
      serviceId: service.id,
      staffId: staffId === "any" ? null : staffId,
      startsAt: new Date(mahe).toISOString(),
      durationMin: service.durationMin || 60,
      priceEur: service.priceEur != null ? service.priceEur : null,
      phone: phone.trim() || null,
    });
    if (res.error) {
      setState("error");
      setMsg(
        res.error === "auth_required" ? "Please log in to book."
        : res.error === "supabase_not_configured" ? "Booking isn't connected yet."
        : res.error === "missing_studio_or_time" ? "This is a preview studio — bookings go live on a real listing."
        : res.error === "slot_taken" ? "That time's just been booked — please pick another."
        : res.error === "outside_hours" ? "That's outside the studio's opening hours."
        : res.error === "studio_unavailable" ? "The studio has blocked that time."
        : res.error === "studio_unclaimed" ? "This studio isn't taking online bookings yet."
        : "Couldn't book — please try another time."
      );
    } else {
      setState("done");
    }
  }

  const wrap = {
    marginTop: 18, background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "18px 18px 20px",
  };
  const chip = (on) => ({
    padding: "8px 13px", borderRadius: "var(--radius-pill)", cursor: "pointer",
    border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
    background: on ? "var(--ink)" : "var(--surface)", color: on ? "var(--surface)" : "var(--text-body)",
    fontSize: "var(--text-sm)", whiteSpace: "nowrap",
  });

  return (
    <div style={wrap} role="dialog" aria-label={"Book " + service.name}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <strong style={{ fontSize: "var(--text-h3)" }}>{service.name}</strong>
        <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginTop: 2 }}>{service.dur} · {service.price}</div>

      {state === "done" ? (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, color: "var(--confirmed)" }}>
          <Icon name="check" size={20} color="var(--confirmed)" />
          <span>Booked — {fmtDay(days[dayIdx])} at {time}. See it in your account.</span>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 14, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>Day</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, overflowX: "auto" }}>
            {days.map((d, i) => (
              <button key={i} style={chip(i === dayIdx)} onClick={() => setDayIdx(i)}>{i === 0 ? "Today" : fmtDay(d)}</button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>Time</div>
          {slots.length > 0 ? (
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              {slots.map((t) => (
                <button key={t} style={chip(t === time)} onClick={() => setTime(t)}>{t}</button>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 6, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              {Array.isArray(hours) && hours.length ? "Closed on this day — try another." : "No online times yet — contact the studio to book."}
            </div>
          )}

          {eligibleTeam.length > 0 && (
            <>
              <div style={{ marginTop: 12, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>With</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <button style={chip(staffId === "any")} onClick={() => setStaffId("any")}>Any professional</button>
                {eligibleTeam.map((p) => (
                  <button key={p.id} style={chip(staffId === p.id)} onClick={() => setStaffId(p.id)}>{p.name}{p.role ? ` · ${p.role}` : ""}</button>
                ))}
              </div>
            </>
          )}

          {user && (
            <>
              <div style={{ marginTop: 12, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>Phone number <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional — only your studio sees it, for last-minute changes)</span></div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="+248 …"
                style={{ marginTop: 6, width: "100%", boxSizing: "border-box", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", color: "var(--text-body)", background: "var(--surface)" }} />
            </>
          )}

          <div style={{ marginTop: 18 }}>
            {loading ? (
              <Button size="lg" disabled>…</Button>
            ) : user ? (
              <Button size="lg" onClick={book} disabled={state === "booking" || !time}>
                {state === "booking" ? "Booking…" : "Confirm booking"}
              </Button>
            ) : (
              <Button size="lg" as="a" href="/login">Log in to book</Button>
            )}
            {state === "error" && <p style={{ color: "var(--clay)", margin: "10px 0 0", fontSize: "var(--text-sm)" }}>{msg}</p>}
          </div>
        </>
      )}
    </div>
  );
}
