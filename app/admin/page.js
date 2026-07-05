"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";

// Real admin console — ADMIN_TOKEN-gated. Tabs: Overview (BI), Studios, Bookings,
// Users. All reads/writes go through /api/admin (service role).
const STATUS_OPTS = ["draft", "unclaimed", "active", "verified", "rejected"];

export default function AdminPage() {
  const [token, setToken] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [tab, setTab] = React.useState("overview");
  const [err, setErr] = React.useState("");
  const [gateState, setGateState] = React.useState("gate"); // gate | loading
  const [bi, setBi] = React.useState(null);
  const [studios, setStudios] = React.useState(null);
  const [bookings, setBookings] = React.useState(null);
  const [users, setUsers] = React.useState(null);
  const [busy, setBusy] = React.useState("");

  const api = React.useCallback(async (action, extra) => {
    const res = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, action, ...(extra || {}) }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || "failed");
    return j;
  }, [token]);

  async function enter(tok) {
    setToken(tok); setErr(""); setGateState("loading");
    try {
      const res = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: tok, action: "bi" }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "failed");
      setBi(j.bi); setReady(true);
      try { localStorage.setItem("sey.admin.token", tok); } catch (e) {}
    } catch (e) {
      setGateState("gate");
      setErr(e.message === "unauthorized" ? "Wrong token." : e.message === "admin_token_not_set" ? "Set ADMIN_TOKEN in Vercel first." : "Couldn't load.");
    }
  }

  React.useEffect(() => { let t = ""; try { t = localStorage.getItem("sey.admin.token") || ""; } catch (e) {} setToken(t); if (t) enter(t); }, []);

  async function go(t) {
    setTab(t);
    try {
      if (t === "studios" && studios == null) setStudios((await api("studios")).studios);
      if (t === "bookings" && bookings == null) setBookings((await api("bookings")).bookings);
      if (t === "users" && users == null) setUsers((await api("users")).users);
    } catch (e) { setErr(e.message); }
  }

  async function refreshBi() { try { setBi((await api("bi")).bi); } catch (e) {} }

  async function studioAction(id, op, value) {
    const labels = { delete: "Delete this studio and ALL its data? This cannot be undone." };
    if (labels[op] && !window.confirm(labels[op])) return;
    setBusy(id + op);
    try { await api("studio", { studioId: id, op, value }); setStudios((await api("studios")).studios); refreshBi(); }
    catch (e) { setErr(e.message); }
    setBusy("");
  }
  async function bookingAction(id, op) {
    setBusy(id + op);
    try { await api("booking", { bookingId: id, op }); setBookings((await api("bookings")).bookings); refreshBi(); }
    catch (e) { setErr(e.message); }
    setBusy("");
  }

  if (!ready) {
    return (
      <Shell>
        <div style={{ maxWidth: 380 }}>
          <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 6px" }}>Admin</h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>Enter your admin token.</p>
          <div style={{ display: "grid", gap: 12 }}>
            <input style={INP} type="password" placeholder="ADMIN_TOKEN" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") enter(token); }} />
            <button style={BTN} onClick={() => enter(token)} disabled={gateState === "loading" || !token}>{gateState === "loading" ? "Loading…" : "Enter"}</button>
            {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: 0 }}>{err}</p>}
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell wide right={<a style={SOFT} href="/admin/prospect">+ New prospect page</a>}>
      <div style={{ display: "flex", gap: 6, marginBottom: 22, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
        {[["overview", "Overview"], ["studios", "Studios"], ["bookings", "Bookings"], ["users", "Users"]].map(([t, l]) => (
          <button key={t} onClick={() => go(t)} style={{ background: "none", border: "none", borderBottom: "2px solid " + (tab === t ? "var(--clay)" : "transparent"), color: tab === t ? "var(--cocoa)" : "var(--cocoa-60)", fontWeight: 600, fontSize: "var(--text-body)", padding: "8px 10px", marginBottom: -1, cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</p>}

      {tab === "overview" && bi && <Overview bi={bi} />}
      {tab === "studios" && <Studios rows={studios} busy={busy} onAction={studioAction} />}
      {tab === "bookings" && <Bookings rows={bookings} busy={busy} onAction={bookingAction} />}
      {tab === "users" && <Users rows={users} />}
    </Shell>
  );
}

function Overview({ bi }) {
  const s = bi.studios || {};
  const max = Math.max(1, ...(bi.bookings_14d || []).map((d) => d.count));
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
        <Stat label="Studios" value={s.total} sub={`${(s.active || 0) + (s.verified || 0)} live · ${s.unclaimed || 0} unclaimed · ${s.draft || 0} draft`} />
        <Stat label="MRR (subscriptions)" value={`${bi.mrr_scr || 0} SCR`} sub="500 SCR × live users" />
        <Stat label="Commission (new clients)" value={`€${bi.commission_eur || 0}`} sub={`${bi.new_clients || 0} acquired`} />
        <Stat label="GMV booked" value={`€${bi.gmv_eur || 0}`} />
        <Stat label="Bookings" value={bi.bookings_total} sub={`${bi.bookings_cancelled || 0} cancelled`} />
        <Stat label="Classes" value={bi.classes} sub={`${bi.class_bookings || 0} joins`} />
        <Stat label="Reviews" value={bi.reviews} sub={bi.avg_rating ? `avg ${bi.avg_rating}★` : "—"} />
        <Stat label="Referrals" value={(bi.referrals_completed || 0) + (bi.referrals_pending || 0)} sub={`${bi.referrals_completed || 0} paid · ${bi.referrals_pending || 0} pending`} />
        <Stat label="Wallet credit out" value={`€${bi.wallet_out_eur || 0}`} />
        <Stat label="Billing-blocked" value={s.blocked || 0} />
      </div>

      <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 10px" }}>Bookings · last 14 days</h2>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: 14 }}>
        {(bi.bookings_14d || []).length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>No bookings in the last 14 days.</span>}
        {(bi.bookings_14d || []).map((d) => (
          <div key={d.day} title={`${d.day}: ${d.count}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: `${Math.round((d.count / max) * 88)}px`, background: "var(--clay)", borderRadius: 4, minHeight: 2 }} />
            <span style={{ fontSize: 9, color: "var(--text-caption)" }}>{String(d.day).slice(5)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Studios({ rows, busy, onAction }) {
  const [q, setQ] = React.useState("");
  if (rows == null) return <Loading />;
  const list = rows.filter((r) => !q || (r.name || "").toLowerCase().includes(q.toLowerCase()) || (r.owner_email || "").toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <input style={{ ...INP, marginBottom: 12, maxWidth: 320 }} placeholder="Search name / email" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={CARD}>
        {list.map((r, i) => (
          <div key={r.id} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ flex: 1, minWidth: 160 }}>
              <a href={`/studio/${r.slug}`} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: "var(--cocoa)", textDecoration: "none" }}>{r.name || r.slug}</a>
              <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{r.owner_email || "—"}{r.billing_blocked ? " · ⛔ blocked" : ""}</span>
            </span>
            <select value={r.status} disabled={busy === r.id + "setStatus"} onChange={(e) => onAction(r.id, "setStatus", e.target.value)}
              style={{ ...INP, padding: "6px 10px", fontSize: "var(--text-sm)" }}>
              {STATUS_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <button style={MINI} disabled={busy === r.id + "markPaid"} onClick={() => onAction(r.id, "markPaid")}>Mark paid</button>
            {r.billing_blocked
              ? <button style={MINI} disabled={busy === r.id + "unblock"} onClick={() => onAction(r.id, "unblock")}>Unblock</button>
              : <button style={MINI} disabled={busy === r.id + "block"} onClick={() => onAction(r.id, "block")}>Block</button>}
            <button style={{ ...MINI, color: "var(--clay)", borderColor: "var(--clay)" }} disabled={busy === r.id + "delete"} onClick={() => onAction(r.id, "delete")}>Delete</button>
          </div>
        ))}
        {list.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No studios.</div>}
      </div>
    </>
  );
}

function Bookings({ rows, busy, onAction }) {
  if (rows == null) return <Loading />;
  const fmt = (iso) => iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : "—";
  return (
    <div style={CARD}>
      {rows.map((b, i) => (
        <div key={b.id} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ width: 130, fontSize: "var(--text-sm)", color: "var(--cocoa)" }}>{fmt(b.startsAt)}</span>
          <span style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontWeight: 600 }}>{b.studio}</span>
            <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{b.service} · {b.client}{b.newClient ? " · new" : ""}</span>
          </span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", minWidth: 90 }}>{b.price != null ? `€${Math.round(b.price)}` : ""}{b.commission ? ` · +€${b.commission} comm` : ""}</span>
          <StatusPill status={b.status} />
          {b.status !== "cancelled" && <button style={MINI} disabled={busy === b.id + "cancel"} onClick={() => onAction(b.id, "cancel")}>Cancel</button>}
          {b.status === "confirmed" && <button style={MINI} disabled={busy === b.id + "complete"} onClick={() => onAction(b.id, "complete")}>Complete</button>}
        </div>
      ))}
      {rows.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No bookings.</div>}
    </div>
  );
}

function Users({ rows }) {
  if (rows == null) return <Loading />;
  return (
    <div style={CARD}>
      {rows.map((u, i) => (
        <div key={u.email + i} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ flex: 1, minWidth: 180, fontWeight: 600, color: "var(--cocoa)", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{u.bookings} bookings</span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>€{u.wallet} wallet</span>
          {u.owns > 0 && <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--eucalyptus)" }}>owner</span>}
        </div>
      ))}
      {rows.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No users yet.</div>}
    </div>
  );
}

// ---- shared ----
const INP = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", width: "100%" };
const BTN = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "12px 22px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };
const SOFT = { ...BTN, background: "transparent", color: "var(--cocoa)", border: "1.5px solid var(--border-strong)", textDecoration: "none" };
const MINI = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", color: "var(--cocoa)" };
const CARD = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", overflow: "hidden" };

function Loading() { return <p style={{ color: "var(--text-muted)" }}>Loading…</p>; }
function Shell({ children, wide, right }) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 20px 60px" }}>
      <div style={{ maxWidth: wide ? 980 : 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <Logo />{right}
        </div>
        {children}
      </div>
    </main>
  );
}
function Stat({ label, value, sub }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
      <div style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--cocoa)", lineHeight: 1.1, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
function StatusPill({ status }) {
  const map = { active: "var(--eucalyptus)", verified: "var(--eucalyptus)", confirmed: "var(--eucalyptus)", completed: "var(--cocoa-60)", unclaimed: "#C79A3B", draft: "var(--cocoa-40)", rejected: "var(--clay)", cancelled: "var(--clay)" };
  const c = map[status] || "var(--cocoa-40)";
  return <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: c, background: "color-mix(in srgb, " + c + " 14%, transparent)", padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{status}</span>;
}
