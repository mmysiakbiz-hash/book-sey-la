"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Icon } from "@/components/brand/Icon";
import { useUser } from "@/lib/useUser";
import { createBooking } from "@/lib/bookings";

const TIMES = ["10:00", "12:00", "14:30", "16:00", "17:30"];
const fmtDay = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// BookNow — a compact date/time picker that writes a real booking to Supabase.
// Login-gated (bookings RLS requires an authenticated customer).
export function BookNow({ studioId, service, team = [], onClose }) {
  const { user, loading } = useUser();
  const [staffId, setStaffId] = React.useState("any");
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
  const [time, setTime] = React.useState(TIMES[2]);
  const [phone, setPhone] = React.useState("");
  const [state, setState] = React.useState("idle"); // idle | booking | done | error
  const [msg, setMsg] = React.useState("");

  // Prefill the WhatsApp number from the profile if we have one.
  React.useEffect(() => {
    const p = user && user.user_metadata && user.user_metadata.phone;
    if (p) setPhone(String(p));
  }, [user]);

  async function book() {
    setState("booking");
    // Interpret the picked day + time as MAHÉ local time (UTC+4, no DST) — not the
    // visitor's browser timezone. Otherwise a client abroad books the wrong slot.
    const d = days[dayIdx];
    const [h, m] = time.split(":").map(Number);
    const pad = (n) => String(n).padStart(2, "0");
    const mahe = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:${pad(m)}:00+04:00`;
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
        : res.error
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
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {TIMES.map((t) => (
              <button key={t} style={chip(t === time)} onClick={() => setTime(t)}>{t}</button>
            ))}
          </div>

          {team && team.length > 0 && (
            <>
              <div style={{ marginTop: 12, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>With</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <button style={chip(staffId === "any")} onClick={() => setStaffId("any")}>Any professional</button>
                {team.map((p) => (
                  <button key={p.id} style={chip(staffId === p.id)} onClick={() => setStaffId(p.id)}>{p.name}{p.role ? ` · ${p.role}` : ""}</button>
                ))}
              </div>
            </>
          )}

          {user && (
            <>
              <div style={{ marginTop: 12, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)" }}>WhatsApp number <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional — for confirmation & reminders)</span></div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="+248 …"
                style={{ marginTop: 6, width: "100%", boxSizing: "border-box", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", color: "var(--text-body)", background: "var(--surface)" }} />
            </>
          )}

          <div style={{ marginTop: 18 }}>
            {loading ? (
              <Button size="lg" disabled>…</Button>
            ) : user ? (
              <Button size="lg" onClick={book} disabled={state === "booking"}>
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
