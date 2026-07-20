"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabaseClient";
import { downloadCSV } from "@/lib/csv";

// Real admin console. Sign in with your email (magic link — you must be an admin,
// i.e. a row in `admins` or listed in ADMIN_EMAILS) or, as a fallback, paste the
// ADMIN_TOKEN. Tabs: Overview (BI), Studios, Bookings, Users. All reads/writes go
// through /api/admin (service role).
const STATUS_OPTS = ["draft", "unclaimed", "active", "verified", "rejected"];

// Low-level call with explicit auth so entry paths don't race React state.
async function call(action, tok, sess, extra) {
  const headers = { "content-type": "application/json" };
  if (sess && sess.access_token) headers.Authorization = "Bearer " + sess.access_token;
  const res = await fetch("/api/admin", { method: "POST", headers, body: JSON.stringify({ token: tok || "", action, ...(extra || {}) }) });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || "failed");
  return j;
}

export default function AdminPage() {
  const [token, setToken] = React.useState("");
  const [session, setSession] = React.useState(null); // supabase session (admin login)
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [tab, setTab] = React.useState("overview");
  const [err, setErr] = React.useState("");
  const [gateState, setGateState] = React.useState("gate"); // gate | loading
  const [bi, setBi] = React.useState(null);
  const [studios, setStudios] = React.useState(null);
  const [bookings, setBookings] = React.useState(null);
  const [users, setUsers] = React.useState(null);
  const [busy, setBusy] = React.useState("");
  const [range, setRange] = React.useState("all"); // all | 7d | 30d | 90d

  const api = React.useCallback((action, extra) => call(action, token, session, extra), [token, session]);

  const gateError = (e) =>
    e.message === "unauthorized" ? "Not authorized — this account isn't an admin." :
    e.message === "admin_not_configured" ? "Set ADMIN_TOKEN or ADMIN_EMAILS in Vercel first." :
    "Couldn't load.";

  async function enter(tok, sess) {
    setErr(""); setGateState("loading");
    try {
      const j = await call("bi", tok, sess);
      setToken(tok || ""); setSession(sess || null);
      setBi(j.bi); setReady(true);
      if (tok) { try { localStorage.setItem("sey.admin.token", tok); } catch (e) {} }
    } catch (e) {
      setGateState("gate");
      setErr(gateError(e));
    }
  }

  // On load: prefer an existing Supabase admin session; else a stored token.
  React.useEffect(() => {
    let stored = ""; try { stored = localStorage.getItem("sey.admin.token") || ""; } catch (e) {}
    (async () => {
      let sess = null;
      if (supabase) { try { const { data } = await supabase.auth.getSession(); sess = data && data.session; } catch (e) {} }
      if (sess) { enter("", sess); return; }
      if (stored) { setToken(stored); enter(stored, null); }
    })();
  }, []);

  // Magic-link return lands here with a fresh session — enter automatically.
  React.useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess && !ready) enter("", sess);
    });
    return () => { try { sub.subscription.unsubscribe(); } catch (e) {} };
  }, [ready]);

  async function sendLink() {
    setErr("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr("Enter a valid email."); return; }
    setGateState("loading");
    try {
      const res = await fetch("/api/auth/magic-link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.trim(), redirectTo: window.location.origin + "/admin" }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.error || "failed");
      setSent(true);
    } catch (e) { setErr("Couldn't send the link. Try again."); }
    setGateState("gate");
  }

  async function signOut() {
    try { if (supabase) await supabase.auth.signOut({ scope: "local" }); } catch (e) {}
    try { localStorage.removeItem("sey.admin.token"); } catch (e) {}
    setSession(null); setToken(""); setReady(false); setBi(null); setStudios(null); setBookings(null); setUsers(null); setSent(false);
  }

  async function go(t) {
    setTab(t);
    try {
      if (t === "studios" && studios == null) setStudios((await api("studios")).studios);
      if (t === "bookings" && bookings == null) setBookings((await api("bookings")).bookings);
      if (t === "users" && users == null) setUsers((await api("users")).users);
    } catch (e) { setErr(e.message); }
  }

  function rangeArgs(key) {
    if (key === "all") return {};
    const days = { "7d": 7, "30d": 30, "90d": 90 }[key] || 30;
    return { from: new Date(Date.now() - days * 864e5).toISOString(), to: new Date().toISOString() };
  }
  async function loadBi(r) { try { setBi((await api("bi", rangeArgs(r))).bi); setRange(r); } catch (e) { setErr(e.message); } }
  async function refreshBi() { try { setBi((await api("bi", rangeArgs(range))).bi); } catch (e) {} }

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
          <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>Sign in with your admin email.</p>
          {sent ? (
            <div style={{ ...CARD, padding: 16 }}>
              <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>Check <strong>{email}</strong> for a sign-in link. Open it on this device.</p>
              <button style={{ ...MINI, marginTop: 12 }} onClick={() => setSent(false)}>Use a different email</button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <input style={INP} type="email" placeholder="you@sey.la" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendLink(); }} />
              <button style={BTN} onClick={sendLink} disabled={gateState === "loading" || !email}>{gateState === "loading" ? "…" : "Email me a link"}</button>
            </div>
          )}
          {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: "12px 0 0" }}>{err}</p>}
          <details style={{ marginTop: 20 }}>
            <summary style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Or use admin token</summary>
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <input style={INP} type="password" placeholder="ADMIN_TOKEN" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") enter(token, null); }} />
              <button style={SOFT} onClick={() => enter(token, null)} disabled={gateState === "loading" || !token}>Enter</button>
            </div>
          </details>
        </div>
      </Shell>
    );
  }

  return (
    <Shell wide right={<span style={{ display: "flex", gap: 10, alignItems: "center" }}><a style={SOFT} href="/admin/prospect">+ New prospect page</a><button style={MINI} onClick={signOut}>Sign out</button></span>}>
      <div style={{ display: "flex", gap: 6, marginBottom: 22, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
        {[["overview", "Overview"], ["studios", "Studios"], ["bookings", "Bookings"], ["users", "Users"]].map(([t, l]) => (
          <button key={t} onClick={() => go(t)} style={{ background: "none", border: "none", borderBottom: "2px solid " + (tab === t ? "var(--clay)" : "transparent"), color: tab === t ? "var(--cocoa)" : "var(--cocoa-60)", fontWeight: 600, fontSize: "var(--text-body)", padding: "8px 10px", marginBottom: -1, cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</p>}

      {tab === "overview" && bi && <Overview bi={bi} range={range} onRange={loadBi} />}
      {tab === "studios" && <Studios rows={studios} busy={busy} onAction={studioAction} />}
      {tab === "bookings" && <Bookings rows={bookings} busy={busy} onAction={bookingAction} />}
      {tab === "users" && <Users rows={users} />}
    </Shell>
  );
}

function Overview({ bi, range, onRange }) {
  const s = bi.studios || {};
  const max = Math.max(1, ...(bi.bookings_14d || []).map((d) => d.count));
  const RANGES = [["all", "All time"], ["7d", "7 days"], ["30d", "30 days"], ["90d", "90 days"]];
  const chartLabel = range === "all" ? "last 14 days" : range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 90 days";
  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", marginRight: 4 }}>Period:</span>
        {RANGES.map(([k, l]) => (
          <button key={k} onClick={() => onRange(k)} style={{ ...MINI, background: range === k ? "var(--clay)" : "var(--surface)", color: range === k ? "var(--surface)" : "var(--cocoa)", borderColor: range === k ? "var(--clay)" : "var(--line)" }}>{l}</button>
        ))}
        <span style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)", marginLeft: 6 }}>Studios &amp; MRR are always current; other metrics use the period.</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
        <Stat label="Studios" value={s.total} sub={`${(s.active || 0) + (s.verified || 0)} live · ${s.unclaimed || 0} unclaimed · ${s.draft || 0} draft`} />
        <Stat label="MRR (subscriptions)" value={`€${bi.mrr_eur || 0}`} sub="€25 × team members · live studios" />
        <Stat label="Commission (new clients)" value={`SCR ${bi.commission_eur || 0}`} sub={`${bi.new_clients || 0} acquired`} />
        <Stat label="GMV booked" value={`SCR ${bi.gmv_eur || 0}`} />
        <Stat label="Bookings" value={bi.bookings_total} sub={`${bi.bookings_cancelled || 0} cancelled`} />
        <Stat label="Classes" value={bi.classes} sub={`${bi.class_bookings || 0} joins`} />
        <Stat label="Reviews" value={bi.reviews} sub={bi.avg_rating ? `avg ${bi.avg_rating}★` : "—"} />
        <Stat label="Referrals" value={(bi.referrals_completed || 0) + (bi.referrals_pending || 0)} sub={`${bi.referrals_completed || 0} paid · ${bi.referrals_pending || 0} pending`} />
        <Stat label="Wallet credit out" value={`SCR ${bi.wallet_out_eur || 0}`} />
        <Stat label="Billing-blocked" value={s.blocked || 0} />
      </div>

      <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 10px" }}>Bookings · {chartLabel}</h2>
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
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <input style={{ ...INP, maxWidth: 320 }} placeholder="Search name / email" value={q} onChange={(e) => setQ(e.target.value)} />
        <button style={MINI} onClick={() => downloadCSV("studios.csv", rows, [{ label: "Name", key: "name" }, { label: "Slug", key: "slug" }, { label: "Status", key: "status" }, { label: "Owner", key: "owner_email" }, { label: "Created", key: "created_at" }, { label: "Blocked", key: "billing_blocked" }])}>Export CSV</button>
      </div>
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
    <>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
      <button style={MINI} onClick={() => downloadCSV("bookings.csv", rows, [{ label: "When", key: "startsAt" }, { label: "Studio", key: "studio" }, { label: "Service", key: "service" }, { label: "Client", key: "client" }, { label: "Price", key: "price" }, { label: "Commission", key: "commission" }, { label: "New", key: "newClient" }, { label: "Status", key: "status" }])}>Export CSV</button>
    </div>
    <div style={CARD}>
      {rows.map((b, i) => (
        <div key={b.id} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ width: 130, fontSize: "var(--text-sm)", color: "var(--cocoa)" }}>{fmt(b.startsAt)}</span>
          <span style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontWeight: 600 }}>{b.studio}</span>
            <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{b.service} · {b.client}{b.newClient ? " · new" : ""}</span>
          </span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", minWidth: 90 }}>{b.price != null ? `SCR ${Math.round(b.price)}` : ""}{b.commission ? ` · +SCR ${b.commission} comm` : ""}</span>
          <StatusPill status={b.status} />
          {b.status !== "cancelled" && <button style={MINI} disabled={busy === b.id + "cancel"} onClick={() => onAction(b.id, "cancel")}>Cancel</button>}
          {b.status === "confirmed" && <button style={MINI} disabled={busy === b.id + "complete"} onClick={() => onAction(b.id, "complete")}>Complete</button>}
        </div>
      ))}
      {rows.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No bookings.</div>}
    </div>
    </>
  );
}

function Users({ rows }) {
  if (rows == null) return <Loading />;
  return (
    <>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
      <button style={MINI} onClick={() => downloadCSV("users.csv", rows, [{ label: "Email", key: "email" }, { label: "Created", key: "created_at" }, { label: "Bookings", key: "bookings" }, { label: "Wallet", key: "wallet" }, { label: "Owns", key: "owns" }])}>Export CSV</button>
    </div>
    <div style={CARD}>
      {rows.map((u, i) => (
        <div key={u.email + i} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ flex: 1, minWidth: 180, fontWeight: 600, color: "var(--cocoa)", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{u.bookings} bookings</span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>SCR {u.wallet} wallet</span>
          {u.owns > 0 && <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--eucalyptus)" }}>owner</span>}
        </div>
      ))}
      {rows.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No users yet.</div>}
    </div>
    </>
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
