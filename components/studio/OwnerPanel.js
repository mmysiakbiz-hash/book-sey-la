"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";
import { sendMagicLink } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { billingStatus } from "@/lib/billing";
import {
  getMyStudio, createDraftStudio, updateStudio,
  saveServices, saveStaff, saveHours, uploadPhoto, publishStudio,
  getStudioBookings, setBookingStatus,
  getOwnerClasses, createClassSession, deleteClassSession,
  claimUnclaimedForMe, rejectListing,
  createOwnerBooking, getStudioClients, saveClientNote,
  getTimeOff, addTimeOff, deleteTimeOff,
  getLoyalty, saveLoyalty, redeemLoyalty, sendMarketing,
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
  const [view, setView] = React.useState(null); // 'bookings' | 'classes' | 'setup'
  const [bookings, setBookings] = React.useState(null);
  const [classes, setClasses] = React.useState(null);
  const [clients, setClients] = React.useState(null);
  const [loyalty, setLoyalty] = React.useState(null);
  const [timeOff, setTimeOff] = React.useState(null);
  const [catalog, setCatalog] = React.useState({ services: [], staff: [] });
  const [justClaimed, setJustClaimed] = React.useState(false);

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
    let res = await getMyStudio();
    if (res && res.error === "supabase_not_configured") { setPhase("nosupabase"); return; }
    if (!res || !res.user) { setPhase("login"); return; }
    // If they own nothing yet, see if there's a pre-listed studio to claim by email.
    if (!res.studio) {
      const claim = await claimUnclaimedForMe();
      if (claim && claim.claimed) { setJustClaimed(true); setStep(STEPS.length - 1); res = await getMyStudio(); }
    }
    setUser(res.user);
    setStudio(res.studio || null);
    if (res.studio) {
      hydrate(res.studio);
      setCatalog({ services: res.studio.services || [], staff: res.studio.staff || [] });
      setView((v) => v || (res.studio.status === "active" ? "bookings" : "setup"));
      loadBookings(res.studio.id);
    } else {
      setView("setup");
    }
    setPhase("wizard");
  }

  async function loadBookings(studioId) {
    const [rows, off] = await Promise.all([getStudioBookings(studioId), getTimeOff(studioId)]);
    setBookings(rows); setTimeOff(off);
  }
  async function loadClasses(studioId) {
    const rows = await getOwnerClasses(studioId);
    setClasses(rows);
  }
  async function loadClients(studioId) {
    const [rows, lp] = await Promise.all([getStudioClients(studioId), getLoyalty(studioId)]);
    setClients(rows); setLoyalty(lp);
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

  async function deleteListing() {
    if (!studio) return;
    if (typeof window !== "undefined" && !window.confirm("Remove this listing? Your page will be hidden from clients. You can’t undo this here.")) return;
    setSaving(true);
    const r = await rejectListing(studio.id);
    setSaving(false);
    if (r.error) { flash("Couldn't remove: " + r.error); return; }
    setStudio(null); setJustClaimed(false); setView("setup"); setF(blankForm());
    flash("Listing removed");
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
          {view === "setup" && <button style={softBtn} onClick={saveExit} disabled={saving}>Save &amp; exit</button>}
        </div>
      </div>

      {justClaimed && (
        <div style={{ background: "var(--blush, #f6ece9)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "var(--cocoa)", fontSize: "var(--text-sm)" }}>
            <b>This is your pre-filled listing.</b> Review &amp; finish it to go live — or remove it if you're not interested.
          </span>
          <button onClick={deleteListing} disabled={saving} style={{ background: "none", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-pill)", padding: "7px 14px", color: "var(--clay)", fontWeight: 600, fontSize: "var(--text-sm)", cursor: "pointer" }}>
            Delete — not interested
          </button>
        </div>
      )}

      {/* owner tabs — only once a studio exists */}
      {studio && (
        <div style={{ display: "flex", gap: 8, marginBottom: 22, borderBottom: "1px solid var(--line)" }}>
          {[["bookings", "Bookings"], ["clients", "Clients"], ["classes", "Classes"], ["billing", "Billing"], ["setup", "Edit page"]].map(([v, lbl]) => (
            <button key={v} onClick={() => { setView(v); if (v === "bookings") loadBookings(studio.id); if (v === "classes") loadClasses(studio.id); if (v === "clients") loadClients(studio.id); }}
              style={{ background: "none", border: "none", borderBottom: "2px solid " + (view === v ? "var(--clay)" : "transparent"), color: view === v ? "var(--cocoa)" : "var(--cocoa-60)", fontWeight: 600, fontSize: "var(--text-body)", padding: "8px 4px", marginBottom: -1, cursor: "pointer" }}>
              {lbl}
            </button>
          ))}
        </div>
      )}

      {view === "bookings" && studio ? (
        <Agenda bookings={bookings} onRefresh={() => loadBookings(studio.id)} onEdit={() => setView("setup")} publicUrl={publicUrl} live={live}
          catalog={catalog} onAdd={(p) => createOwnerBooking(studio.id, p)}
          timeOff={timeOff} onAddTimeOff={(p) => addTimeOff(studio.id, p)} onDeleteTimeOff={deleteTimeOff} />
      ) : view === "clients" && studio ? (
        <Clients2 clients={clients} loyalty={loyalty}
          onSaveNote={(email, note) => saveClientNote(studio.id, email, note)}
          onSaveLoyalty={async (p) => { const r = await saveLoyalty(studio.id, p); loadClients(studio.id); return r; }}
          onRedeem={async (email) => { await redeemLoyalty(studio.id, email); loadClients(studio.id); }} />
      ) : view === "classes" && studio ? (
        <Classes studioId={studio.id} classes={classes} onRefresh={() => loadClasses(studio.id)} />
      ) : view === "billing" && studio ? (
        <Billing studio={studio} staffCount={f.staff.filter((s) => s.name && s.name.trim()).length} />
      ) : (
      <>
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
          <Section
            title={live ? "Your page is live" : justClaimed ? "Your page is ready 🎉" : "Ready to go live?"}
            hint={live ? "You can keep editing any step — changes save as you go."
              : justClaimed ? "We pre-filled everything from public info. Preview it, then publish to go live — or tweak any section first."
              : "Publishing makes your page public with its own URL. You can edit anytime."}>
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
      </>
      )}
    </Shell>
  );
}

function Agenda({ bookings, onRefresh, onEdit, publicUrl, live, catalog, onAdd, timeOff, onAddTimeOff, onDeleteTimeOff }) {
  const [busy, setBusy] = React.useState(null);
  const [adding, setAdding] = React.useState(false);
  const [blocking, setBlocking] = React.useState(false);
  if (bookings == null) return <p style={{ color: "var(--text-muted)" }}>Loading bookings…</p>;

  const now = Date.now();
  const active = bookings.filter((b) => b.status !== "cancelled");
  const upcoming = active.filter((b) => b.start && b.start.getTime() >= now - 3600000).sort((a, b) => a.start - b.start);
  const past = active.filter((b) => !b.start || b.start.getTime() < now - 3600000).sort((a, b) => (b.start || 0) - (a.start || 0));

  const dayLabel = (d) => d ? d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Indian/Mahe" }) : "—";
  const timeLabel = (d) => d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : "";

  async function act(id, status) {
    setBusy(id);
    await setBookingStatus(id, status);
    await onRefresh();
    setBusy(null);
  }

  const groups = [];
  let curr = null;
  upcoming.forEach((b) => {
    const key = b.start ? b.start.toDateString() : "none";
    if (!curr || curr.key !== key) { curr = { key, label: dayLabel(b.start), items: [] }; groups.push(curr); }
    curr.items.push(b);
  });

  const card = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
        <button onClick={() => { setBlocking((v) => !v); setAdding(false); }} style={{ ...softBtn, padding: "9px 16px", fontSize: "var(--text-sm)" }}>{blocking ? "Close" : "Block time"}</button>
        <button onClick={() => { setAdding((v) => !v); setBlocking(false); }} style={{ ...primaryBtn, padding: "9px 18px", fontSize: "var(--text-sm)" }}>{adding ? "Close" : "+ Add appointment"}</button>
      </div>
      {adding && <AddAppointment catalog={catalog} onAdd={onAdd} onDone={() => { setAdding(false); onRefresh(); }} />}
      {blocking && <BlockTime onAdd={onAddTimeOff} onDone={() => { setBlocking(false); onRefresh(); }} />}
      {Array.isArray(timeOff) && timeOff.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-caption)", margin: "0 0 6px" }}>Blocked time</div>
          <div style={{ display: "grid", gap: 6 }}>
            {timeOff.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px dashed var(--line-strong)", borderRadius: "var(--radius-md)", padding: "8px 12px" }}>
                <span style={{ flex: 1, fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>
                  {t.start ? t.start.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : "—"}
                  {t.end ? " → " + t.end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : ""}
                  {t.reason ? ` · ${t.reason}` : ""}
                </span>
                <button onClick={async () => { await onDeleteTimeOff(t.id); onRefresh(); }} style={{ border: "none", background: "none", color: "var(--cocoa-40)", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!live && (
        <div style={{ background: "var(--blush, #f6ece9)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: 18, fontSize: "var(--text-sm)", color: "var(--cocoa)" }}>
          Your page isn't published yet — clients can't book. <a onClick={onEdit} style={{ color: "var(--clay)", fontWeight: 600, cursor: "pointer" }}>Finish setup →</a>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: "var(--cocoa)" }}>No bookings yet</p>
          <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>When clients book {publicUrl ? "your page" : ""}, they'll show up here.</p>
        </div>
      ) : (
        <>
          {groups.map((g) => (
            <div key={g.key} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--cocoa)", margin: "0 0 10px" }}>{g.label}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {g.items.map((b) => (
                  <div key={b.id} style={card}>
                    <div style={{ width: 58, fontWeight: 700, color: "var(--clay)", fontSize: "var(--text-sm)" }}>{timeLabel(b.start)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "var(--cocoa)" }}>{b.service}</div>
                      <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{b.client}{b.staff ? ` · ${b.staff}` : ""}{b.price != null ? ` · €${Math.round(b.price)}` : ""}</div>
                    </div>
                    <button onClick={() => act(b.id, "cancelled")} disabled={busy === b.id}
                      style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--cocoa-60)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
                      {busy === b.id ? "…" : "Cancel"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {past.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--cocoa-60)", margin: "0 0 10px" }}>Past</div>
              <div style={{ display: "grid", gap: 8 }}>
                {past.slice(0, 20).map((b) => (
                  <div key={b.id} style={{ ...card, opacity: 0.72 }}>
                    <div style={{ width: 58, fontSize: "var(--text-xs)", color: "var(--cocoa-40)" }}>{b.start ? b.start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "var(--cocoa)" }}>{b.service}</div>
                      <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{b.client}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Billing({ studio, staffCount }) {
  const b = billingStatus(studio, staffCount);
  const fmtDate = (ms) => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const banners = {
    trial: { bg: "var(--blush, #f6ece9)", title: `Free trial — ${Math.max(0, b.daysUntilDue)} days left`, sub: `Your first 3 months are on us. Billing starts ${fmtDate(b.dueAt)}.` },
    active: { bg: "var(--blush, #f6ece9)", title: "Active", sub: `Paid through ${fmtDate(b.dueAt)}.` },
    due: { bg: "#fff4e6", title: `Payment due — ${Math.max(0, b.daysUntilBlock)} days to pay`, sub: `Please settle by ${fmtDate(b.blockAt)} to keep your page live.` },
    overdue: { bg: "#fdeceb", title: "Payment overdue", sub: `Your account will be suspended shortly. Pay now to stay live.` },
    blocked: { bg: "#fdeceb", title: "Account suspended", sub: `Your page is hidden from clients until payment is received.` },
  };
  const bn = banners[b.state] || banners.trial;
  const card = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px" };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ ...card, background: bn.bg, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "var(--cocoa)", fontSize: "var(--text-h3)" }}>{bn.title}</div>
        <div style={{ color: "var(--cocoa-80)", marginTop: 4, fontSize: "var(--text-sm)" }}>{bn.sub}</div>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 10 }}>Your plan</div>
        <div style={{ display: "grid", gap: 8, fontSize: "var(--text-sm)" }}>
          <Row k="Users billed" v={`${b.users}`} />
          <Row k="Rate" v={`${b.perUser} SCR / user`} />
          <Row k="Subscription per cycle" v={<b>{b.amount} SCR</b>} />
          <Row k="New-client commission" v={`${Math.round(b.commissionRate * 100)}% of the first booking`} />
          <Row k={b.state === "trial" ? "Free until" : "Next due"} v={fmtDate(b.dueAt)} />
          <Row k="Grace period" v={`${b.graceDays} days`} />
        </div>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 6 }}>Payment</div>
        <p style={{ color: "var(--cocoa-60)", fontSize: "var(--text-sm)", margin: "0 0 12px" }}>
          Card payments (Stripe) are coming soon. You'll be able to add a card here before your trial ends — nothing is charged during the free period.
        </p>
        <button disabled title="Stripe integration coming soon"
          style={{ background: "var(--line-strong, #d9d4cf)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "12px 22px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "not-allowed", opacity: 0.8 }}>
          Set up payment — coming soon
        </button>
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: "var(--cocoa-60)" }}>{k}</span><span style={{ color: "var(--cocoa)", fontWeight: 600 }}>{v}</span></div>;
}

function Classes({ studioId, classes, onRefresh }) {
  const [form, setForm] = React.useState({ name: "", date: "", time: "", durationMin: 60, capacity: 10, price: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const upd = (patch) => setForm((v) => ({ ...v, ...patch }));

  async function add() {
    setErr("");
    if (!form.name.trim() || !form.date || !form.time) { setErr("Add a name, date and time."); return; }
    setBusy(true);
    const startISO = new Date(`${form.date}T${form.time}`).toISOString();
    const r = await createClassSession(studioId, { name: form.name, startISO, durationMin: form.durationMin, capacity: form.capacity, price: form.price });
    setBusy(false);
    if (r.error) { setErr("Couldn't add: " + r.error); return; }
    setForm({ name: "", date: "", time: "", durationMin: 60, capacity: 10, price: "" });
    onRefresh();
  }
  async function del(id) { setBusy(true); await deleteClassSession(id); setBusy(false); onRefresh(); }

  const inp = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const card = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 18, marginBottom: 22 }}>
        <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 12 }}>Add a class</div>
        <div style={{ display: "grid", gap: 8 }}>
          <input style={inp} placeholder="Class name (e.g. Sunrise beach yoga)" value={form.name} onChange={(e) => upd({ name: e.target.value })} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input style={{ ...inp, flex: 1 }} type="date" value={form.date} onChange={(e) => upd({ date: e.target.value })} />
            <input style={{ ...inp, flex: 1 }} type="time" value={form.time} onChange={(e) => upd({ time: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label style={{ flex: 1 }}><span style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>Minutes</span><input style={{ ...inp, width: "100%" }} type="number" value={form.durationMin} onChange={(e) => upd({ durationMin: e.target.value })} /></label>
            <label style={{ flex: 1 }}><span style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>Capacity</span><input style={{ ...inp, width: "100%" }} type="number" value={form.capacity} onChange={(e) => upd({ capacity: e.target.value })} /></label>
            <label style={{ flex: 1 }}><span style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>Price €</span><input style={{ ...inp, width: "100%" }} type="number" value={form.price} onChange={(e) => upd({ price: e.target.value })} /></label>
          </div>
          <button style={{ ...primaryBtn, justifySelf: "start" }} onClick={add} disabled={busy}>{busy ? "Saving…" : "Add class"}</button>
          {err && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</span>}
        </div>
      </div>

      {classes == null ? <p style={{ color: "var(--text-muted)" }}>Loading…</p>
        : classes.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>No classes yet. Add one above — it shows on your public page with live spots.</p>
        : (
          <div style={{ display: "grid", gap: 8 }}>
            {classes.map((c) => (
              <div key={c.id} style={card}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--cocoa)" }}>{c.name}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>
                    {c.start ? c.start.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" }) : "—"}
                    {c.price != null ? ` · €${Math.round(c.price)}` : ""} · {c.booked}/{c.capacity != null ? c.capacity : "∞"} booked
                  </div>
                </div>
                <button onClick={() => del(c.id)} disabled={busy} style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--cocoa-60)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>Delete</button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function AddAppointment({ catalog, onAdd, onDone }) {
  const services = (catalog && catalog.services) || [];
  const staff = (catalog && catalog.staff) || [];
  const [f, setF] = React.useState({ name: "", phone: "", serviceId: services[0] ? services[0].id : "", staffId: "", date: "", time: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const set = (p) => setF((v) => ({ ...v, ...p }));
  const inp = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };

  async function add() {
    setErr("");
    if (!f.name.trim() || !f.date || !f.time) { setErr("Add a client name, date and time."); return; }
    const svc = services.find((s) => s.id === f.serviceId);
    setBusy(true);
    const r = await onAdd({
      name: f.name, phone: f.phone,
      serviceId: f.serviceId || null, staffId: f.staffId || null,
      startISO: new Date(`${f.date}T${f.time}`).toISOString(),
      durationMin: svc ? svc.duration_min : 60,
      priceEur: svc && svc.price_eur != null ? svc.price_eur : null,
    });
    setBusy(false);
    if (r && r.error) { setErr("Couldn't add: " + r.error); return; }
    onDone();
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 16, marginBottom: 18 }}>
      <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 12 }}>New appointment (walk-in / phone)</div>
      <div style={{ display: "grid", gap: 8 }}>
        <input style={inp} placeholder="Client name" value={f.name} onChange={(e) => set({ name: e.target.value })} />
        <input style={inp} placeholder="Phone (optional)" value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
        {services.length > 0 && (
          <select style={inp} value={f.serviceId} onChange={(e) => set({ serviceId: e.target.value })}>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}{s.price_eur != null ? ` · €${Math.round(s.price_eur)}` : ""}</option>)}
          </select>
        )}
        {staff.length > 0 && (
          <select style={inp} value={f.staffId} onChange={(e) => set({ staffId: e.target.value })}>
            <option value="">Any professional</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inp, flex: 1 }} type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} />
          <input style={{ ...inp, flex: 1 }} type="time" value={f.time} onChange={(e) => set({ time: e.target.value })} />
        </div>
        <button style={{ ...primaryBtn, justifySelf: "start" }} onClick={add} disabled={busy}>{busy ? "Adding…" : "Add appointment"}</button>
        {err && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</span>}
      </div>
    </div>
  );
}

function MarketingComposer({ count }) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState("");
  async function send() {
    if (!msg.trim()) return;
    if (typeof window !== "undefined" && !window.confirm(`Email this to your clients (up to ${count})?`)) return;
    setBusy(true); setResult("");
    const r = await sendMarketing(msg);
    setBusy(false);
    if (r && r.ok) { setResult(`Sent to ${r.sent}/${r.recipients} clients.`); setMsg(""); }
    else setResult("Couldn't send" + (r && r.error ? ` (${r.error})` : "") + ".");
  }
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: "var(--text-sm)" }}><b style={{ color: "var(--cocoa)" }}>Message clients</b> <span style={{ color: "var(--text-muted)" }}>· email a promo or announcement</span></span>
        <button onClick={() => setOpen((v) => !v)} style={{ border: "1px solid var(--border-strong)", background: "none", borderRadius: 999, padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", color: "var(--cocoa)" }}>{open ? "Close" : "Compose"}</button>
      </div>
      {open && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={"e.g. 20% off cuts this week — book your slot!"}
            style={{ width: "100%", boxSizing: "border-box", resize: "vertical", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" }} />
          <button style={{ ...primaryBtn, justifySelf: "start", padding: "9px 18px", fontSize: "var(--text-sm)" }} onClick={send} disabled={busy || !msg.trim()}>{busy ? "Sending…" : "Send to clients"}</button>
          {result && <span style={{ fontSize: "var(--text-sm)", color: "var(--eucalyptus)", fontWeight: 600 }}>{result}</span>}
        </div>
      )}
    </div>
  );
}

function LoyaltyEditor({ loyalty, onSave }) {
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ stamps_required: (loyalty && loyalty.stamps_required) || 6, reward: (loyalty && loyalty.reward) || "", active: !!(loyalty && loyalty.active) });
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { setF({ stamps_required: (loyalty && loyalty.stamps_required) || 6, reward: (loyalty && loyalty.reward) || "", active: !!(loyalty && loyalty.active) }); }, [loyalty]);
  const inp = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "9px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  async function save() { setBusy(true); await onSave(f); setBusy(false); setOpen(false); }
  const summary = loyalty && loyalty.active ? `Active — ${loyalty.stamps_required} visits → ${loyalty.reward || "reward"}` : "Off — reward repeat clients with a stamp card";
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: "var(--text-sm)" }}><b style={{ color: "var(--cocoa)" }}>Loyalty</b> <span style={{ color: "var(--text-muted)" }}>· {summary}</span></span>
        <button onClick={() => setOpen((v) => !v)} style={{ border: "1px solid var(--border-strong)", background: "none", borderRadius: 999, padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", color: "var(--cocoa)" }}>{open ? "Close" : "Edit"}</button>
      </div>
      {open && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)" }}>
            Visits needed <input style={{ ...inp, width: 80 }} type="number" value={f.stamps_required} onChange={(e) => setF((v) => ({ ...v, stamps_required: e.target.value }))} />
          </label>
          <input style={inp} placeholder="Reward (e.g. 6th visit 50% off)" value={f.reward} onChange={(e) => setF((v) => ({ ...v, reward: e.target.value }))} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--cocoa)" }}>
            <input type="checkbox" checked={f.active} onChange={(e) => setF((v) => ({ ...v, active: e.target.checked }))} /> Active (show on your page)
          </label>
          <button style={{ ...primaryBtn, justifySelf: "start", padding: "8px 16px", fontSize: "var(--text-sm)" }} onClick={save} disabled={busy}>{busy ? "Saving…" : "Save loyalty"}</button>
        </div>
      )}
    </div>
  );
}

function BlockTime({ onAdd, onDone }) {
  const [f, setF] = React.useState({ date: "", from: "", to: "", reason: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const set = (p) => setF((v) => ({ ...v, ...p }));
  const inp = { boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  async function add() {
    setErr("");
    if (!f.date || !f.from || !f.to) { setErr("Pick a date and a from/to time."); return; }
    setBusy(true);
    const r = await onAdd({ startISO: new Date(`${f.date}T${f.from}`).toISOString(), endISO: new Date(`${f.date}T${f.to}`).toISOString(), reason: f.reason });
    setBusy(false);
    if (r && r.error) { setErr("Couldn't block: " + r.error); return; }
    onDone();
  }
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 16, marginBottom: 18 }}>
      <div style={{ fontWeight: 700, color: "var(--cocoa)", marginBottom: 12 }}>Block time (day off / break)</div>
      <div style={{ display: "grid", gap: 8 }}>
        <input style={inp} type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} />
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inp, flex: 1 }} type="time" value={f.from} onChange={(e) => set({ from: e.target.value })} />
          <input style={{ ...inp, flex: 1 }} type="time" value={f.to} onChange={(e) => set({ to: e.target.value })} />
        </div>
        <input style={inp} placeholder="Reason (optional)" value={f.reason} onChange={(e) => set({ reason: e.target.value })} />
        <button style={{ ...primaryBtn, justifySelf: "start" }} onClick={add} disabled={busy}>{busy ? "Blocking…" : "Block this time"}</button>
        {err && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>{err}</span>}
      </div>
    </div>
  );
}

function Clients2({ clients, loyalty, onSaveNote, onSaveLoyalty, onRedeem }) {
  const [open, setOpen] = React.useState(null); // client key with note editor open
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const req = loyalty && loyalty.stamps_required ? loyalty.stamps_required : 0;
  const active = !!(loyalty && loyalty.active && req);
  const stampsOf = (c) => Math.max(0, (c.visits || 0) - (c.redemptions || 0) * req);

  if (clients == null) return <p style={{ color: "var(--text-muted)" }}>Loading clients…</p>;

  async function saveNote(c) {
    setBusy(true);
    await onSaveNote(c.email || c.name, draft);
    setBusy(false); setOpen(null);
    c.note = draft;
  }
  const card = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "12px 14px" };

  return (
    <div style={{ maxWidth: 640, display: "grid", gap: 8 }}>
      <MarketingComposer count={clients.length} />
      <LoyaltyEditor loyalty={loyalty} onSave={onSaveLoyalty} />
      {clients.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>No clients yet — they appear here after their first booking.</p>}
      {clients.map((c) => (
        <div key={c.key} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ flex: 1, minWidth: 160 }}>
              <span style={{ fontWeight: 600, color: "var(--cocoa)" }}>{c.name}</span>
              <span style={{ display: "block", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{c.email || c.phone || "—"}</span>
            </span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{c.visits} visit{c.visits === 1 ? "" : "s"}</span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>€{Math.round(c.spent)}</span>
            {active && <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: stampsOf(c) >= req ? "var(--eucalyptus)" : "var(--cocoa-40)" }}>{Math.min(stampsOf(c), req)}/{req} 🎁</span>}
            {active && stampsOf(c) >= req && c.email && (
              <button onClick={() => onRedeem(c.email)} style={{ border: "1px solid var(--eucalyptus)", background: "var(--surface)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 700, cursor: "pointer", color: "var(--eucalyptus)" }}>Redeem</button>
            )}
            <button onClick={() => { setOpen(open === c.key ? null : c.key); setDraft(c.note || ""); }}
              style={{ border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, padding: "6px 12px", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", color: "var(--cocoa)" }}>
              {c.note ? "Note ✓" : "Add note"}
            </button>
          </div>
          {open === c.key && (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Private note (allergies, preferences…)"
                style={{ width: "100%", boxSizing: "border-box", resize: "vertical", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" }} />
              <button style={{ ...primaryBtn, justifySelf: "start", padding: "8px 16px", fontSize: "var(--text-sm)" }} onClick={() => saveNote(c)} disabled={busy || !(c.email)}>{busy ? "Saving…" : "Save note"}</button>
              {!c.email && <span style={{ color: "var(--text-caption)", fontSize: "var(--text-xs)" }}>Notes need an email on the client.</span>}
            </div>
          )}
        </div>
      ))}
    </div>
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
