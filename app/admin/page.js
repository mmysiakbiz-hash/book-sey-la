"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";

// Real admin dashboard — gated by ADMIN_TOKEN (remembered locally). Shows live
// counts across all studios plus a studios list and a link to the prospect tool.
export default function AdminPage() {
  const [token, setToken] = React.useState("");
  const [data, setData] = React.useState(null);
  const [state, setState] = React.useState("gate"); // gate | loading | ready | error
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let t = "";
    try { t = localStorage.getItem("sey.admin.token") || ""; } catch (e) {}
    setToken(t);
    if (t) load(t);
  }, []);

  async function load(tok) {
    setState("loading"); setErr("");
    try {
      const res = await fetch("/api/admin/stats", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: tok }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.studios) { setData(j); setState("ready"); try { localStorage.setItem("sey.admin.token", tok); } catch (e) {} }
      else { setState("gate"); setErr(j.error === "unauthorized" ? "Wrong token." : j.error === "admin_token_not_set" ? "Set ADMIN_TOKEN in Vercel first." : "Couldn't load."); }
    } catch (e) { setState("gate"); setErr("Network error."); }
  }

  const field = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const btn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "12px 22px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };
  const softBtn = { ...btn, background: "transparent", color: "var(--cocoa)", border: "1.5px solid var(--border-strong)" };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 20px 60px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <Logo />
          {state === "ready" && (
            <div style={{ display: "flex", gap: 10 }}>
              <a style={softBtn} href="/admin/prospect">+ New prospect page</a>
              <button style={softBtn} onClick={() => load(token)}>Refresh</button>
            </div>
          )}
        </div>

        {(state === "gate" || state === "loading") && (
          <div style={{ maxWidth: 380 }}>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 6px" }}>Admin</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>Enter your admin token to continue.</p>
            <div style={{ display: "grid", gap: 12 }}>
              <input style={field} type="password" placeholder="ADMIN_TOKEN" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(token); }} />
              <button style={btn} onClick={() => load(token)} disabled={state === "loading" || !token}>{state === "loading" ? "Loading…" : "Enter"}</button>
              {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: 0 }}>{err}</p>}
            </div>
          </div>
        )}

        {state === "ready" && data && (
          <>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 16px" }}>Overview</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 26 }}>
              <Stat label="Studios" value={data.studios.total} sub={`${data.studios.active + data.studios.verified} live · ${data.studios.unclaimed} unclaimed`} />
              <Stat label="Bookings" value={data.bookings} />
              <Stat label="Classes" value={data.classes} />
              <Stat label="Reviews" value={data.reviews} />
              <Stat label="Referrals" value={data.referrals.total} sub={`${data.referrals.completed} paid · ${data.referrals.pending} pending`} />
              <Stat label="Blocked" value={data.studios.blocked} sub="billing" />
            </div>

            <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 12px" }}>Studios</h2>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              {data.studios.list.length === 0 && <div style={{ padding: 16, color: "var(--text-muted)" }}>No studios yet.</div>}
              {data.studios.list.map((s, i) => (
                <div key={s.slug + i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <a href={`/studio/${s.slug}`} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: "var(--cocoa)", textDecoration: "none" }}>{s.name || s.slug}</a>
                    {s.ownerEmail && <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{s.ownerEmail}</span>}
                  </span>
                  <StatusPill status={s.status} />
                  <a href={`/claim/${s.slug}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent-link)", fontSize: "var(--text-xs)", fontWeight: 600 }}>claim ↗</a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
      <div style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontSize: "var(--text-h2)", fontWeight: 700, color: "var(--cocoa)", lineHeight: 1.1, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
function StatusPill({ status }) {
  const map = { active: "var(--eucalyptus)", verified: "var(--eucalyptus)", unclaimed: "var(--brass, #C79A3B)", draft: "var(--cocoa-40)", rejected: "var(--clay)" };
  const c = map[status] || "var(--cocoa-40)";
  return <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: c, background: "color-mix(in srgb, " + c + " 14%, transparent)", padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{status}</span>;
}
