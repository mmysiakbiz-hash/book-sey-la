"use client";
import React from "react";
import CustomerAccount from "@/components/sections/CustomerAccount";
import { Button } from "@/components/core/Button";
import { useUser } from "@/lib/useUser";
import { getMyBookings } from "@/lib/bookings";
import { getFavouriteStudios } from "@/lib/favourites";
import { signOut } from "@/lib/auth";

function fmtRange(during) {
  // tstzrange like ["2026-07-06 14:30:00+00","2026-07-06 15:30:00+00")
  const m = /([0-9T :+\-\.]+)"?,"?([0-9T :+\-\.]+)/.exec(during || "");
  if (!m) return "";
  const d = new Date(m[1].trim().replace(" ", "T"));
  if (isNaN(d)) return "";
  return d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AccountPage() {
  const { user, loading } = useUser();
  const [bookings, setBookings] = React.useState(null);
  const [faves, setFaves] = React.useState(null);

  React.useEffect(() => {
    if (user) { getMyBookings().then(setBookings); getFavouriteStudios().then(setFaves); }
    else { setBookings(null); setFaves(null); }
  }, [user]);

  return (
    <>
      <div style={{ background: "var(--bg-dark)", color: "var(--text-on-dark)" }}>
        <div className="sey-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", flexWrap: "wrap" }}>
          {loading ? (
            <span style={{ opacity: 0.7 }}>…</span>
          ) : user ? (
            <>
              <span style={{ fontSize: "var(--text-sm)" }}>Signed in as <b>{user.email}</b></span>
              <Button variant="secondary" size="sm" onClick={() => signOut()}>Log out</Button>
            </>
          ) : (
            <>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-on-dark-muted)" }}>You're browsing as a guest — log in to see your real bookings.</span>
              <Button size="sm" as="a" href="/login">Log in</Button>
            </>
          )}
        </div>
      </div>

      {user && bookings && bookings.length > 0 && (
        <section style={{ background: "var(--bg-alt)", borderBottom: "1px solid var(--line)" }}>
          <div className="sey-container" style={{ padding: "20px 0" }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Your bookings</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {bookings.map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
                  <span style={{ fontWeight: 600 }}>{fmtRange(b.during) || "Booking"}</span>
                  <span style={{ display: "inline-flex", gap: 12, alignItems: "center", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                    {b.price_eur != null && <span>€{Math.round(b.price_eur)}</span>}
                    <span style={{ color: "var(--confirmed)", fontWeight: 600 }}>{b.status || "confirmed"}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {user && faves && faves.length > 0 && (
        <section style={{ background: "var(--bg-alt)", borderBottom: "1px solid var(--line)" }}>
          <div className="sey-container" style={{ padding: "20px 0" }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Saved studios</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {faves.map((s) => (
                <a key={s.studioId} href={s.slug ? `/studio/${s.slug}` : "#"} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "10px 14px", textDecoration: "none", color: "inherit" }}>
                  {s.photo && <img src={s.photo} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flex: "none" }} />}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 600 }}>{s.name}</span>
                    <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{s.category}{s.location ? ` · ${s.location}` : ""}</span>
                  </span>
                  <span style={{ color: "var(--accent-link)", fontSize: "var(--text-sm)", fontWeight: 600 }}>View →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CustomerAccount />
    </>
  );
}
