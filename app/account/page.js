"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { useUser } from "@/lib/useUser";
import { getMyBookings, getMyRewards } from "@/lib/bookings";
import { getFavouriteStudios } from "@/lib/favourites";
import { getWallet } from "@/lib/wallet";
import { ReferStudio } from "@/components/booking/ReferStudio";
import { AccountDetails } from "@/components/booking/AccountDetails";
import { MyBookings } from "@/components/booking/MyBookings";
import { signOut } from "@/lib/auth";

export default function AccountPage() {
  const { user, loading } = useUser();
  const [bookings, setBookings] = React.useState(null);
  const [faves, setFaves] = React.useState(null);
  const [wallet, setWallet] = React.useState(null);
  const [rewards, setRewards] = React.useState(null);

  React.useEffect(() => {
    if (user) { getMyBookings().then(setBookings); getFavouriteStudios().then(setFaves); getWallet().then(setWallet); getMyRewards().then(setRewards); }
    else { setBookings(null); setFaves(null); setWallet(null); setRewards(null); }
  }, [user]);

  const firstName = user ? String(user.user_metadata?.name || user.email || "there").split("@")[0].split(" ")[0] : "";

  return (
    <>
      {/* Warm account header (greeting + sign-out) instead of a hard black bar. */}
      <header style={{ background: "var(--blush)", borderBottom: "1px solid var(--line)" }}>
        <div className="sey-container" style={{ paddingBlock: "clamp(28px, 5vw, 44px) clamp(24px, 4vw, 34px)" }}>
          <div className="sey-eyebrow" style={{ marginBottom: 12 }}>My account</div>
          {loading ? (
            <h1 style={{ fontSize: "var(--text-h1)", margin: 0, opacity: 0.5 }}>…</h1>
          ) : user ? (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: "var(--text-h1)", margin: 0, lineHeight: 1.1 }}>Hi, <em className="sey-accent-italic">{firstName}</em></h1>
                <p style={{ color: "var(--text-muted)", margin: "8px 0 0", fontSize: "var(--text-sm)" }}>Signed in as {user.email}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button size="sm" as="a" href="/search">Book something new</Button>
                <Button variant="secondary" size="sm" onClick={() => signOut()}>Log out</Button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 520 }}>
              <h1 style={{ fontSize: "var(--text-h1)", margin: "0 0 10px", lineHeight: 1.1 }}>Your <em className="sey-accent-italic">account</em></h1>
              <p style={{ color: "var(--text-muted)", margin: "0 0 22px" }}>
                Log in to see your bookings, saved studios, rewards and wallet — all in one place. It's free, always.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button size="lg" as="a" href="/login">Log in or sign up</Button>
                <Button variant="secondary" size="lg" as="a" href="/search">Browse studios</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {user && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Your details</h2>
            <AccountDetails user={user} />
          </div>
        </section>
      )}

      {user && bookings && bookings.length > 0 && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Your bookings</h2>
            <MyBookings bookings={bookings} />
          </div>
        </section>
      )}

      {user && rewards && rewards.length > 0 && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Your rewards</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {rewards.map((r) => (
                <a key={r.studioId} href={r.slug ? `/studio/${r.slug}` : "#"} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px", textDecoration: "none", color: "inherit" }}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 600 }}>{r.name}</span>
                    <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{r.eligible ? `🎁 Reward ready: ${r.reward}` : `${r.stamps}/${r.required} visits → ${r.reward}`}</span>
                  </span>
                  <span style={{ display: "inline-flex", gap: 3 }}>
                    {Array.from({ length: r.required }, (_, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < r.stamps ? "var(--clay)" : "var(--line-strong)" }} />)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {user && faves && faves.length > 0 && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
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

      {user && wallet && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Wallet</h2>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Balance</span>
                <span style={{ fontSize: "var(--text-h2)", fontWeight: 700 }}>€{wallet.balance.toFixed(0)}</span>
              </div>
              {wallet.transactions.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: "10px 0 0" }}>No credit yet — invite a studio to earn €15 toward your bookings.</p>
              ) : (
                <div style={{ display: "grid", gap: 8, marginTop: 12, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                  {wallet.transactions.map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: "var(--text-sm)" }}>
                      <span style={{ color: "var(--cocoa)" }}>{t.note || t.kind || "Credit"}</span>
                      <span style={{ fontWeight: 600, color: t.amount >= 0 ? "var(--confirmed)" : "var(--clay)" }}>{t.amount >= 0 ? "+" : ""}€{t.amount.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {user && (
        <section>
          <div className="sey-container" style={{ paddingBlock: "22px", maxWidth: 720 }}>
            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Invite a studio · €15</h2>
            <ReferStudio />
          </div>
        </section>
      )}
    </>
  );
}
