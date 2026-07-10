"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { PROSPECT_CATEGORIES } from "@/lib/prospectPresets";

// Admin tool: generate a pre-listed page for one prospect and get the links to
// send. Gated by ADMIN_TOKEN (remembered locally for convenience).
export default function ProspectPage() {
  const [token, setToken] = React.useState("");
  const [f, setF] = React.useState({ name: "", category: "Barber", email: "", island: "Mahé", address: "", phone: "", tagline: "" });
  const [svc, setSvc] = React.useState([]); // optional overrides; empty → preset menu
  const [photos, setPhotos] = React.useState(""); // optional, comma/newline separated
  const [state, setState] = React.useState("idle");
  const [res, setRes] = React.useState(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => { try { setToken(localStorage.getItem("sey.admin.token") || ""); } catch (e) {} }, []);
  const set = (p) => setF((v) => ({ ...v, ...p }));

  async function submit() {
    setErr(""); setRes(null);
    if (!f.name.trim()) { setErr("Name is required."); return; }
    try { localStorage.setItem("sey.admin.token", token); } catch (e) {}
    setState("sending");
    const photoList = photos.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    const services = svc.filter((s) => s.name && s.name.trim());
    try {
      const r = await fetch("/api/prospect", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, ...f, photos: photoList, services }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { setRes(j); setState("idle"); }
      else { setState("idle"); setErr(j.error === "unauthorized" ? "Wrong admin token." : j.error === "admin_token_not_set" ? "Set ADMIN_TOKEN in Vercel first." : (j.error || "Failed.")); }
    } catch (e) { setState("idle"); setErr("Network error."); }
  }

  const field = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const label = { display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa)", margin: "0 0 6px" };
  const btn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "13px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer" };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 20px 60px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}><Logo /></div>
        <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 4px" }}>New prospect page</h1>
        <p style={{ color: "var(--text-muted)", margin: "0 0 22px", fontSize: "var(--text-sm)" }}>Enter the basics — we fill the rest from category presets so it looks finished. You get a public link and a claim link to send.</p>

        <div style={{ display: "grid", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 20 }}>
          <label><span style={label}>Admin token</span><input style={field} type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_TOKEN" /></label>
          <label><span style={label}>Studio name *</span><input style={field} value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. L'Accent Barber" /></label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={{ flex: 1, minWidth: 160 }}><span style={label}>Category *</span><select style={field} value={f.category} onChange={(e) => set({ category: e.target.value })}>{PROSPECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
            <label style={{ flex: 1, minWidth: 160 }}><span style={label}>Island</span><select style={field} value={f.island} onChange={(e) => set({ island: e.target.value })}>{["Mahé", "Praslin", "La Digue", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          </div>
          <label><span style={label}>Address</span><input style={field} value={f.address} onChange={(e) => set({ address: e.target.value })} placeholder="Victoria, Mahé" /></label>
          <label><span style={label}>Owner email (for claim)</span><input style={field} type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="studio@email.com" /></label>
          <label><span style={label}>Phone / WhatsApp</span><input style={field} value={f.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+248 …" /></label>
          <label><span style={label}>Tagline (optional — else preset)</span><input style={field} value={f.tagline} onChange={(e) => set({ tagline: e.target.value })} /></label>
          <label><span style={label}>Photo URLs (optional — one per line, else preset)</span><textarea style={{ ...field, resize: "vertical" }} rows={2} value={photos} onChange={(e) => setPhotos(e.target.value)} placeholder="https://…" /></label>

          <div>
            <span style={label}>Services (optional — leave empty for a preset menu)</span>
            {svc.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...field, flex: 2 }} placeholder="Service" value={s.name} onChange={(e) => setSvc(svc.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                <input style={{ ...field, width: 80 }} type="number" placeholder="min" value={s.duration_min} onChange={(e) => setSvc(svc.map((x, j) => j === i ? { ...x, duration_min: e.target.value } : x))} />
                <input style={{ ...field, width: 80 }} type="number" placeholder="SCR" value={s.price_eur} onChange={(e) => setSvc(svc.map((x, j) => j === i ? { ...x, price_eur: e.target.value } : x))} />
              </div>
            ))}
            <button onClick={() => setSvc([...svc, { name: "", duration_min: 60, price_eur: "" }])} style={{ background: "none", border: "1.5px solid var(--border-strong)", borderRadius: "var(--radius-pill)", padding: "7px 14px", fontWeight: 600, fontSize: "var(--text-sm)", cursor: "pointer", color: "var(--cocoa)" }}>+ Add service</button>
          </div>

          <button style={btn} onClick={submit} disabled={state === "sending"}>{state === "sending" ? "Creating…" : "Create prospect page"}</button>
          {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: 0 }}>{err}</p>}
        </div>

        {res && (
          <div style={{ marginTop: 18, background: "var(--surface)", border: "1px solid var(--eucalyptus)", borderRadius: "var(--radius-lg)", padding: 20 }}>
            <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 12 }}>Page ready 🎉</div>
            <LinkRow label="Public page (preview / share)" url={res.studioUrl} />
            <LinkRow label="Claim link (send to the studio)" url={res.claimUrl} />
          </div>
        )}
      </div>
    </main>
  );
}

function LinkRow({ label, url }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-caption)", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <a href={url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--accent-link)", fontSize: "var(--text-sm)" }}>{url}</a>
        <button onClick={() => { try { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) {} }}
          style={{ border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", color: "var(--cocoa)", flex: "none" }}>{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
}
