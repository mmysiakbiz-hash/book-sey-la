"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { sendMagicLink } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import {
  getMyStudio, createDraftStudio, updateStudio,
  saveServices, saveStaff, saveHours, uploadPhoto, publishStudio,
} from "@/lib/owner";

const CATEGORIES = ["Hair", "Nails", "Spa & massage", "Barber", "Brows & lashes", "Makeup", "Skin & facial", "Waxing", "Tattoo", "Piercing", "Fitness & yoga", "Personal trainer"];
const ISLANDS = ["Mahé", "Praslin", "La Digue", "Other"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; // day_of_week 0..6

const minToHHMM = (m) => (m == null ? "" : `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
const hhmmToMin = (s) => { if (!s) return null; const [h, m] = s.split(":").map(Number); return h * 60 + (m || 0); };

const STEPS = ["Basics", "About", "Location", "Hours", "Services", "Team", "Photos", "Contact", "Publish"];

// ---- small style helpers (consistent with the site tokens) ----
const field = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
const label = { display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa)", margin: "0 0 6px" };
const primaryBtn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "12px 22px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", cursor: "pointer" };
const softBtn = { background: "transparent", color: "var(--cocoa)", border: "1.5px solid var(--border-strong)", borderRadius: "var(--radius-pill)", padding: "12px 20px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };

export default function OwnerPanel() {
  const [phase, setPhase] = React.useState("loading"); // loading | login | wizard | nosupabase
  const [user, setUser] = React.useState(null);
  const [studio, setStudio] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  // login form
  const [email, setEmail] = React.useState("");
  const [loginState, setLoginState] = React.useState("idle");

  // editable form state
  const [f, setF] = React.useState(blankForm());

  function blankForm() {
    return {
      name: "", category: "", tagline: "", bio: "",
      address: "", island: "", lat: "", lng: "",
      hours: DAYS.map((_, i) => ({ day_of_week: i, open: i < 6 ? "09:00" : "", close: i < 6 ? "18:00" : "" })),
      services: [{ name: "", duration_min: 60, price_eur: "" }],
      staff: [{ name: "", role: "" }],
      photos: [],
      socials: { instagram: "", facebook: "", tiktok: "", website: "" }, whatsapp: "",
    };
  }

  function hydrate(s) {
    if (!s) return;
    const hoursByDay = DAYS.map((_, i) => {
      const row = (s.business_hours || []).find((h) => h.day_of_week === i);
      return row ? { day_of_week: i, open: minToHHMM(row.open_min), close: minToHHMM(row.close_min) } : { day_of_week: i, open: "", close: "" };
    });
    setF({
      name: s.name || "", category: s.category || "", tagline: s.tagline || "", bio: s.bio || "",
      address: s.address || "", island: s.island || "", lat: s.lat ?? "", lng: s.lng ?? "",
      hours: hoursByDay,
      services: (s.services && s.services.length ? [...s.services].sort((a, b) => (a.sort || 0) - (b.sort || 0)).map((x) => ({ name: x.name || "", duration_min: x.duration_min || 60, price_eur: x.price_eur ?? "" })) : [{ name: "", duration_min: 60, price_eur: "" }]),
      staff: (s.staff && s.staff.length ? s.staff.map((x) => ({ name: x.name || "", role: x.role || "" })) : [{ name: "", role: "" }]),
      photos: Array.isArray(s.photos) ? s.photos : [],
      socials: Object.assign({ instagram: "", facebook: "", tiktok: "", website: "" }, s.socials || {}),
      whatsapp: s.whatsapp || "",
    });
  }

  async function load() {
    const res = await getMyStudio();
    if (res && res.error === "supabase_not_configured") { setPhase("nosupabase"); return; }
    if (!res || !res.user) { setPhase("login"); return; }
    setUser(res.user);
    setStudio(res.studio || null);
    if (res.studio) hydrate(res.studio);
    setPhase("wizard");
  }

  React.useEffect(() => {
    load();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") load();
    });
    return () => { try { data.subscription.unsubscribe(); } catch (e) {} };
  }, []);

  const set = (patch) => setF((v) => ({ ...v, ...patch }));
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  async function ensureStudio() {
    if (studio) return studio;
    const res = await createDraftStudio({ name: f.name, category: f.category });
    if (res.error) { flash("Couldn't create: " + res.error); return null; }
    const s = { id: res.data.id, slug: res.data.slug, status: "draft" };
    setStudio(s);
    return s;
  }

  // Persist the current step, return true on success.
  async function persist(stepIndex) {
    setSaving(true);
    try {
      const s = await ensureStudio();
      if (!s) return false;
      let r = { ok: true };
      if (stepIndex === 0) r = await updateStudio(s.id, { name: f.name, category: f.category || null });
      else if (stepIndex === 1) r = await updateStudio(s.id, { tagline: f.tagline || null, bio: f.bio || null });
      else if (stepIndex === 2) r = await updateStudio(s.id, { address: f.address || null, island: f.island || null, lat: f.lat === "" ? null : Number(f.lat), lng: f.lng === "" ? null : Number(f.lng) });
      else if (stepIndex === 3) r = await saveHours(s.id, f.hours.map((h) => ({ day_of_week: h.day_of_week, open_min: hhmmToMin(h.open), close_min: hhmmToMin(h.close) })));
      else if (stepIndex === 4) r = await saveServices(s.id, f.services);
      else if (stepIndex === 5) r = await saveStaff(s.id, f.staff);
      else if (stepIndex === 6) r = await updateStudio(s.id, { photos: f.photos });
      else if (stepIndex === 7) r = await updateStudio(s.id, { socials: f.socials, whatsapp: f.whatsapp || null });
      if (r && r.error) { flash("Save failed: " + r.error); return false; }
      return true;
    } finally { setSaving(false); }
  }

  async function next() { if (await persist(step)) { flash("Saved"); setStep((s) => Math.min(STEPS.length - 1, s + 1)); } }
  async function saveExit() { if (await persist(step)) flash("Saved — you can finish later"); }

  async function doLogin() {
    if (!email.trim()) return;
    setLoginState("sending");
    const redirectTo = window.location.origin + "/panel";
    const res = await sendMagicLink(email.trim(), redirectTo);
    setLoginState(res && res.ok ? "sent" : "error");
  }

  async function onUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const s = await ensureStudio();
    if (!s) return;
    setSaving(true);
    const urls = [];
    for (const file of files) {
      const r = await uploadPhoto(s.id, file);
      if (r.url) urls.push(r.url); else flash("Upload failed: " + r.error);
    }
    setSaving(false);
    if (urls.length) { const nextPhotos = [...f.photos, ...urls]; set({ photos: nextPhotos }); await updateStudio(s.id, { photos: nextPhotos }); }
  }

  async function publish() {
    if (!(await persist(step))) return;
    const s = await ensureStudio();
    setSaving(true);
    const r = await publishStudio(s.id);
    setSaving(false);
    if (r.error) { flash("Publish failed: " + r.error); return; }
    setStudio((v) => ({ ...v, status: "active" }));
    flash("Published — your page is live 🎉");
  }

  // ---------- render ----------
  if (phase === "loading") return <Shell><p style={{ color: "var(--text-muted)" }}>Loading…</p></Shell>;

  if (phase === "nosupabase") return <Shell><h1 style={{ fontSize: "var(--text-h3)" }}>Setup unavailable</h1><p style={{ color: "var(--text-muted)" }}>Supabase isn't configured for this deployment yet.</p></Shell>;

  if (phase === "login") {
    return (
      <Shell>
        <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 6px" }}>Create your studio page</h1>
        <p style={{ color: "var(--text-muted)", margin: "0 0 20px" }}>First, log in or sign up — we'll email you a magic link. Then you'll build your page step by step.</p>
        {loginState === "sent" ? (
          <p style={{ color: "var(--cocoa)" }}>Check your email — we sent a sign-in link to <b>{email}</b>. Open it on this device and you'll come right back here.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, maxWidth: 380 }}>
            <input style={field} type="email" inputMode="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") doLogin(); }} />
            <button style={primaryBtn} disabled={loginState === "sending" || !email.trim()} onClick={doLogin}>{loginState === "sending" ? "Sending…" : "Send magic link"}</button>
            {loginState === "error" && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>Couldn't send the link. Please try again.</p>}
          </div>
        )}
      </Shell>
    );
  }

  const live = studio && studio.status === "active";
  const publicUrl = studio && studio.slug ? `/studio/${studio.slug}` : null;

  return (
    <Shell wide>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-h2)", margin: 0 }}>{studio ? (f.name || "Your studio") : "Create your studio page"}</h1>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0", fontSize: "var(--text-sm)" }}>
            {live ? <>Live at <a href={publicUrl} style={{ color: "var(--accent-link)" }}>{publicUrl}</a></> : "Draft — not visible to clients yet"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {publicUrl && <a style={softBtn} href={publicUrl} target="_blank" rel="noreferrer">Preview</a>}
          <button style={softBtn} onClick={saveExit} disabled={saving}>Save &amp; exit</button>
        </div>
      </div>

      {/* step nav */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            style={{ border: "1px solid " + (i === step ? "var(--clay)" : "var(--line)"), background: i === step ? "var(--clay)" : "var(--surface)", color: i === step ? "#fff" : "var(--cocoa-80)", borderRadius: "var(--radius-pill)", padding: "7px 14px", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer" }}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "22px 22px", maxWidth: 640 }}>
        {step === 0 && (
          <Section title="The basics" hint="What's your studio called, and what do you do?">
            <L t="Studio name"><input style={field} value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Kreol Spa" /></L>
            <L t="Category"><select style={field} value={f.category} onChange={(e) => set({ category: e.target.value })}><option value="">Choose…</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></L>
          </Section>
        )}

        {step === 1 && (
          <Section title="About your studio" hint="A warm line for the top of your page, and a short description.">
            <L t="Tagline"><input style={field} value={f.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="A quiet island ritual, steps from the sand." /></L>
            <L t="Description"><textarea style={{ ...field, resize: "vertical" }} rows={5} value={f.bio} onChange={(e) => set({ bio: e.target.value })} placeholder="Tell clients what makes your place special." /></L>
          </Section>
        )}

        {step === 2 && (
          <Section title="Location" hint="Where can clients find you?">
            <L t="Address"><input style={field} value={f.address} onChange={(e) => set({ address: e.target.value })} placeholder="Beau Vallon, Mahé" /></L>
            <L t="Island"><select style={field} value={f.island} onChange={(e) => set({ island: e.target.value })}><option value="">Choose…</option>{ISLANDS.map((c) => <option key={c} value={c}>{c}</option>)}</select></L>
            <div style={{ display: "flex", gap: 12 }}>
              <L t="Latitude (optional)"><input style={field} value={f.lat} onChange={(e) => set({ lat: e.target.value })} placeholder="-4.62" /></L>
              <L t="Longitude (optional)"><input style={field} value={f.lng} onChange={(e) => set({ lng: e.target.value })} placeholder="55.42" /></L>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="Opening hours" hint="Leave a day blank to mark it closed.">
            <div style={{ display: "grid", gap: 8 }}>
              {f.hours.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 96, fontSize: "var(--text-sm)", color: "var(--cocoa-80)" }}>{DAYS[i]}</span>
                  <input style={{ ...field, padding: "9px 10px" }} type="time" value={h.open} onChange={(e) => { const hs = f.hours.slice(); hs[i] = { ...hs[i], open: e.target.value }; set({ hours: hs }); }} />
                  <span style={{ color: "var(--cocoa-40)" }}>–</span>
                  <input style={{ ...field, padding: "9px 10px" }} type="time" value={h.close} onChange={(e) => { const hs = f.hours.slice(); hs[i] = { ...hs[i], close: e.target.value }; set({ hours: hs }); }} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {step === 4 && (
          <Section title="Services" hint="What clients can book, with price and duration.">
            <Rows items={f.services} onChange={(services) => set({ services })} blank={{ name: "", duration_min: 60, price_eur: "" }} render={(row, upd) => (
              <>
                <input style={{ ...field, flex: 2 }} placeholder="Service name" value={row.name} onChange={(e) => upd({ name: e.target.value })} />
                <input style={{ ...field, width: 90 }} type="number" placeholder="min" value={row.duration_min} onChange={(e) => upd({ duration_min: e.target.value })} />
                <input style={{ ...field, width: 90 }} type="number" placeholder="€" value={row.price_eur} onChange={(e) => upd({ price_eur: e.target.value })} />
              </>
            )} addLabel="Add service" />
          </Section>
        )}

        {step === 5 && (
          <Section title="Your team" hint="The people clients can book with (optional).">
            <Rows items={f.staff} onChange={(staff) => set({ staff })} blank={{ name: "", role: "" }} render={(row, upd) => (
              <>
                <input style={{ ...field, flex: 2 }} placeholder="Name" value={row.name} onChange={(e) => upd({ name: e.target.value })} />
                <input style={{ ...field, flex: 2 }} placeholder="Role (e.g. Barber)" value={row.role} onChange={(e) => upd({ role: e.target.value })} />
              </>
            )} addLabel="Add team member" />
          </Section>
        )}

        {step === 6 && (
          <Section title="Photos" hint="Your first photo becomes the cover. Add a few — they make your page shine.">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              {f.photos.map((url, i) => (
                <div key={url + i} style={{ position: "relative", width: 104, height: 104, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button aria-label="Remove" onClick={() => { const p = f.photos.filter((_, j) => j !== i); set({ photos: p }); if (studio) updateStudio(studio.id, { photos: p }); }}
                    style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer", lineHeight: 1 }}>×</button>
                  {i === 0 && <span style={{ position: "absolute", bottom: 4, left: 4, background: "var(--clay)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999 }}>Cover</span>}
                </div>
              ))}
            </div>
            <label style={{ ...softBtn, display: "inline-block" }}>
              {saving ? "Uploading…" : "Upload photos"}
              <input type="file" accept="image/*" multiple onChange={onUpload} style={{ display: "none" }} />
            </label>
          </Section>
        )}

        {step === 7 && (
          <Section title="Contact & social" hint="How clients reach you beyond booking.">
            <L t="WhatsApp"><input style={field} value={f.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} placeholder="+248 …" /></L>
            <L t="Instagram"><input style={field} value={f.socials.instagram} onChange={(e) => set({ socials: { ...f.socials, instagram: e.target.value } })} placeholder="https://instagram.com/…" /></L>
            <L t="Facebook"><input style={field} value={f.socials.facebook} onChange={(e) => set({ socials: { ...f.socials, facebook: e.target.value } })} placeholder="https://facebook.com/…" /></L>
            <L t="TikTok"><input style={field} value={f.socials.tiktok} onChange={(e) => set({ socials: { ...f.socials, tiktok: e.target.value } })} placeholder="https://tiktok.com/@…" /></L>
            <L t="Website"><input style={field} value={f.socials.website} onChange={(e) => set({ socials: { ...f.socials, website: e.target.value } })} placeholder="https://…" /></L>
          </Section>
        )}

        {step === 8 && (
          <Section title={live ? "Your page is live" : "Ready to go live?"} hint={live ? "You can keep editing any step — changes save as you go." : "Publishing makes your page public with its own URL. You can edit anytime."}>
            <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              <Check ok={!!f.name}>Studio name</Check>
              <Check ok={!!f.category}>Category</Check>
              <Check ok={!!(f.tagline || f.bio)}>Description</Check>
              <Check ok={!!(f.address || f.island)}>Location</Check>
              <Check ok={f.hours.some((h) => h.open && h.close)}>Opening hours</Check>
              <Check ok={f.services.some((s) => s.name && s.name.trim())}>At least one service</Check>
              <Check ok={f.photos.length > 0}>At least one photo</Check>
            </ul>
            {live
              ? publicUrl && <a style={primaryBtn} href={publicUrl} target="_blank" rel="noreferrer">View your live page ↗</a>
              : <button style={primaryBtn} onClick={publish} disabled={saving || !f.name}>{saving ? "Publishing…" : "Publish my page"}</button>}
          </Section>
        )}

        {step < 8 && (
          <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center" }}>
            {step > 0 && <button style={softBtn} onClick={() => setStep((s) => s - 1)}>Back</button>}
            <button style={primaryBtn} onClick={next} disabled={saving}>{saving ? "Saving…" : "Continue"}</button>
            {msg && <span style={{ color: "var(--eucalyptus)", fontSize: "var(--text-sm)", fontWeight: 600 }}>{msg}</span>}
          </div>
        )}
        {step === 8 && msg && <p style={{ color: "var(--eucalyptus)", fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 14 }}>{msg}</p>}
      </div>
    </Shell>
  );
}

function Shell({ children, wide }) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "28px 20px 60px" }}>
      <div style={{ maxWidth: wide ? 900 : 520, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}><Logo /></div>
        {children}
      </div>
    </main>
  );
}
function Section({ title, hint, children }) {
  return (
    <div>
      <h2 style={{ fontSize: "var(--text-h3)", margin: "0 0 4px" }}>{title}</h2>
      {hint && <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>{hint}</p>}
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </div>
  );
}
function L({ t, children }) { return <label style={{ display: "block", flex: 1 }}><span style={label}>{t}</span>{children}</label>; }
function Check({ ok, children }) {
  return <li style={{ display: "flex", alignItems: "center", gap: 8, color: ok ? "var(--cocoa)" : "var(--cocoa-40)", fontSize: "var(--text-sm)" }}>
    <span style={{ width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", background: ok ? "var(--eucalyptus)" : "var(--line-strong)", color: "#fff", fontSize: 12 }}>{ok ? "✓" : ""}</span>{children}
  </li>;
}
function Rows({ items, onChange, render, blank, addLabel }) {
  const upd = (i, patch) => { const next = items.map((r, j) => (j === i ? { ...r, ...patch } : r)); onChange(next); };
  const remove = (i) => onChange(items.length > 1 ? items.filter((_, j) => j !== i) : [{ ...blank }]);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {render(row, (patch) => upd(i, patch))}
          <button aria-label="Remove" onClick={() => remove(i)} style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--cocoa-40)", width: 38, height: 38, borderRadius: 10, cursor: "pointer", flex: "none" }}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { ...blank }])} style={{ ...softBtn, justifySelf: "start", padding: "8px 16px", fontSize: "var(--text-sm)" }}>+ {addLabel}</button>
    </div>
  );
}
