"use client";
import React from "react";
import { Icon } from "@/components/brand/Icon";
// sey.la | book — Salon panel (responsive). Phone: "My day" agenda. Desktop: swimlane + config.

  
  const { useState, useEffect } = React;
  const U = "https://images.unsplash.com/photo-", q = "?auto=format&fit=crop&w=120&q=70";

  const STAFF = [
    { id: "a", name: "Aline", role: "Massage", color: "#6F8265", soft: "#E7ECE3", av: U+"1544005313-94ddf0286df2"+q },
    { id: "d", name: "Denis", role: "Barber", color: "#A8503F", soft: "#F1DED6", av: U+"1500648767791-00dcc994a43e"+q },
    { id: "m", name: "Maya", role: "Nails", color: "#B2925F", soft: "#EFE6D6", av: U+"1534528741775-53994a69daeb"+q },
    { id: "n", name: "Nadia", role: "Facials", color: "#5B7B8A", soft: "#E1EAEE", av: U+"1531123897727-8f129e1688ce"+q },
  ];
  // hour grid 9..18
  const HOURS = Array.from({ length: 10 }, (_, i) => 9 + i);
  const APPTS = [
    { id: 1, staff: "a", start: 9, len: 1, client: "Sara M.", svc: "Coconut & frangipani massage", price: 55, av: U+"1544005313-94ddf0286df2"+q, tag: "loyal", loyalty: "5/6" },
    { id: 2, staff: "a", start: 10.5, len: 1.25, client: "James O.", svc: "Deep tissue", price: 58, av: U+"1500648767791-00dcc994a43e"+q },
    { id: 3, staff: "a", start: 14, len: 1, client: "Ravi P.", svc: "Hot stone therapy", price: 65, av: U+"1506794778202-cad84cf45f1d"+q, tag: "new" },
    { id: 4, staff: "d", start: 9.5, len: 0.75, client: "Marc T.", svc: "Skin fade & beard", price: 28, av: U+"1519085360753-af0119f7cbe7"+q },
    { id: 5, staff: "d", start: 11, len: 0.5, client: "Leo K.", svc: "Classic cut", price: 20, av: U+"1507003211169-0a1dd7228f2d"+q, tag: "loyal", loyalty: "9/10" },
    { id: 6, staff: "d", start: 13, len: 1, client: "Blocked · lunch", svc: "", blocked: true },
    { id: 7, staff: "d", start: 15, len: 0.75, client: "Tomas R.", svc: "Hot-towel shave", price: 22, av: U+"1500648767791-00dcc994a43e"+q },
    { id: 8, staff: "m", start: 10, len: 1, client: "Nadia R.", svc: "BIAB overlay", price: 42, av: U+"1534528741775-53994a69daeb"+q },
    { id: 9, staff: "m", start: 12.5, len: 0.75, client: "Priya S.", svc: "Gel manicure", price: 30, av: U+"1508214751196-bcfd4ca60f91"+q, tag: "new" },
    { id: 10, staff: "m", start: 15.5, len: 1, client: "Chloe B.", svc: "Pedicure spa", price: 38, av: U+"1544005313-94ddf0286df2"+q },
    { id: 11, staff: "n", start: 9, len: 1, client: "Aisha D.", svc: "Signature Creole facial", price: 48, av: U+"1531123897727-8f129e1688ce"+q },
    { id: 12, staff: "n", start: 11.5, len: 0.75, client: "Grace W.", svc: "Express glow facial", price: 32, av: U+"1524504388940-b1c1722653e1"+q, tag: "loyal", loyalty: "3/8" },
    { id: 13, staff: "n", start: 14.5, len: 1, client: "Lena F.", svc: "LED & peel", price: 62, av: U+"1502823403499-6ccfcf4fb453"+q },
  ];
  const staffOf = (id) => STAFF.find((s) => s.id === id);
  const fmt = (h) => { const hr = Math.floor(h), m = Math.round((h - hr) * 60); return String(hr).padStart(2, "0") + ":" + String(m).padStart(2, "0"); };

  function Ic(p) { return React.createElement(Icon, Object.assign({ size: 20 }, p)); }

  // ---------- MOBILE: My day agenda ----------
  function Agenda({ appts, onAction, checked }) {
    const sorted = appts.slice().sort((a, b) => a.start - b.start);
    let lastLabel = null;
    return (
      <div className="sp-agenda">
        {sorted.map((a) => {
          const st = staffOf(a.staff);
          const label = a.start < 12 ? "Morning" : a.start < 17 ? "Afternoon" : "Evening";
          const showLabel = label !== lastLabel; lastLabel = label;
          if (a.blocked) return (
            <React.Fragment key={a.id}>
              {showLabel && <div className="sp-slotlabel">{label}</div>}
              <div className="appt" style={{ "--staff": "var(--cocoa-40)", background: "var(--shell-alt)" }}>
                <div className="appt-head"><span className="appt-time">{fmt(a.start)}</span><span className="appt-dur">· lunch break</span></div>
              </div>
            </React.Fragment>
          );
          const done = checked.includes(a.id);
          return (
            <React.Fragment key={a.id}>
              {showLabel && <div className="sp-slotlabel">{label}</div>}
              <div className="appt" style={{ "--staff": st.color }}>
                <div className="appt-head">
                  <span className="appt-time">{fmt(a.start)}–{fmt(a.start + a.len)}</span>
                  <span className="appt-dur">· {Math.round(a.len * 60)} min · {st.name}</span>
                </div>
                <div className="appt-client">
                  <img className="appt-av" src={a.av} alt="" />
                  <div><div className="appt-name">{a.client}</div><div className="appt-svc">{a.svc}</div></div>
                  <span className="appt-price">€{a.price}</span>
                </div>
                <div className="appt-tags">
                  {a.tag === "new" && <span className="tagpill new"><Ic name="sparkle" size={12} color="var(--eucalyptus)" /> New client</span>}
                  {a.tag === "loyal" && <span className="tagpill loyal"><Ic name="star" size={12} color="var(--clay)" fill="var(--clay)" /> Loyalty {a.loyalty}</span>}
                </div>
                <div className="appt-actions">
                  <button className={done ? "done" : "primary"} onClick={() => onAction("check", a.id)}>
                    <Ic name="check" size={16} color={done ? "var(--eucalyptus)" : "var(--cream)"} /> {done ? "Checked in" : "Check in"}
                  </button>
                  <button onClick={() => onAction("reschedule", a.id)}><Ic name="calendar" size={16} /> Move</button>
                  <button onClick={() => onAction("cancel", a.id)}><Ic name="close" size={16} /></button>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // ---------- DESKTOP: swimlane ----------
  function Swimlane() {
    const rowH = 64; // px per hour
    return (
      <div className="sp-cal">
        <div className="cal-grid" style={{ "--lanes": STAFF.length }}>
          <div className="cal-corner" />
          {STAFF.map((s) => (
            <div className="cal-staff" key={s.id}><img src={s.av} alt="" /><div><b>{s.name}</b><br /><span>{s.role}</span></div></div>
          ))}
          <div className="cal-timecol">
            {HOURS.map((h) => <div className="cal-time" key={h}>{fmt(h)}</div>)}
          </div>
          {STAFF.map((s) => (
            <div className="cal-lane" key={s.id}>
              {HOURS.map((h) => <div className="cal-cell" key={h} />)}
              {APPTS.filter((a) => a.staff === s.id).map((a) => (
                <div key={a.id} className={"cal-appt" + (a.blocked ? " blocked" : "")}
                  style={{ top: (a.start - 9) * rowH + 1, height: a.len * rowH - 3, "--staff": s.color, "--staff-soft": s.soft }}>
                  <div className="t">{fmt(a.start)}</div>
                  <div className="c">{a.client}</div>
                  {a.svc && <div className="s">{a.svc} · €{a.price}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ConfigPanels() {
    const services = [
      ["Coconut & frangipani massage", "60 min", 55], ["Hot stone therapy", "75 min", 65],
      ["Signature Creole facial", "50 min", 48], ["Skin fade & beard", "45 min", 28],
    ];
    const reviews = [["Sara M.", 5, "Floating after the massage — booking took seconds."], ["James O.", 5, "Same-day slot, spotless place."], ["Nadia R.", 4, "Lovely; weekend parking is tricky."]];
    return (
      <div className="sp-config">
        <div className="cfg">
          <h3>Services & pricing</h3>
          <p>What clients can book and what they pay.</p>
          {services.map((s) => (
            <div className="cfg-row" key={s[0]}><span className="k">{s[0]}</span><span className="v">{s[1]} · <span className="cfg-price">€{s[2]}</span></span></div>
          ))}
        </div>
        <div className="cfg">
          <h3>Team & hours</h3>
          <p>Staff, roles and working days.</p>
          {STAFF.map((s) => (
            <div className="cfg-row" key={s.id}><span className="k">{s.name}</span><span className="v">{s.role} · Mon–Sat</span></div>
          ))}
        </div>
        <div className="cfg">
          <h3>Google reviews</h3>
          <p>Synced from your Google Business profile.</p>
          {reviews.map((r) => (
            <div className="cfg-row" key={r[0]}>
              <span className="k">{r[0]}</span>
              <span className="stars-sm">{Array.from({ length: r[1] }).map((_, i) => <Ic key={i} name="star" size={13} color="var(--clay)" fill="var(--clay)" />)}</span>
            </div>
          ))}
        </div>
        <div className="cfg">
          <h3>This week</h3>
          <p>Bookings, revenue and utilisation.</p>
          <div className="cfg-row"><span className="k">Bookings</span><span className="cfg-price">86</span></div>
          <div className="cfg-row"><span className="k">Revenue</span><span className="cfg-price">€3,940</span></div>
          <div className="cfg-row"><span className="k">Chair utilisation</span><span className="cfg-price">78%</span></div>
          <div className="cfg-row"><span className="k">New clients</span><span className="cfg-price">14</span></div>
        </div>
        <div className="cfg">
          <h3>Payments</h3><p>Deposits, no-show protection and payouts.</p>
          <div className="cfg-row"><span className="k">Require deposit</span><span className="v">20% · on for new clients</span></div>
          <div className="cfg-row"><span className="k">No-show fee</span><span className="v">€15 · charged after 12h</span></div>
          <div className="cfg-row"><span className="k">Gift cards sold</span><span className="v">€420 outstanding</span></div>
          <div className="cfg-row"><span className="k">Next payout</span><span className="cfg-price">€3,116 · Fri</span></div>
        </div>
      </div>
    );
  }

  // ---------- Appointment sheet (new / edit / block) ----------
  function ApptSheet({ mode, appt, onClose, onSave, onDelete }) {
    const [block, setBlock] = useState(mode === "block");
    const [client, setClient] = useState(appt ? appt.client : "");
    const [staff, setStaff] = useState(appt ? appt.staff : STAFF[0].id);
    const [time, setTime] = useState(appt ? fmt(appt.start) : "10:00");
    const svc = appt ? appt.svc : "";
    return (
      <>
        <div className="sp-scrim" onClick={onClose} />
        <div className="sp-sheet">
          <div className="sp-sheet-grab" />
          <div className="sp-sheet-title">{mode === "edit" ? "Edit appointment" : block ? "Block time" : "New appointment"}</div>
          {mode !== "edit" && (
            <div className="seg">
              <button className={!block ? "is-on" : ""} onClick={() => setBlock(false)}>Appointment</button>
              <button className={block ? "is-on" : ""} onClick={() => setBlock(true)}>Block time</button>
            </div>
          )}
          {!block && <label className="sp-field"><span>Client</span><input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Name or phone (walk-in / call)" /></label>}
          {!block && <label className="sp-field"><span>Service</span><input defaultValue={svc} placeholder="e.g. Skin fade & beard · €28" /></label>}
          <label className="sp-field"><span>Staff</span>
            <select value={staff} onChange={(e) => setStaff(e.target.value)}>{STAFF.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.role}</option>)}</select>
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <label className="sp-field" style={{ flex: 1 }}><span>Time</span><input value={time} onChange={(e) => setTime(e.target.value)} /></label>
            <label className="sp-field" style={{ flex: 1 }}><span>Duration</span><select defaultValue="60"><option>30 min</option><option>45 min</option><option value="60">60 min</option><option>90 min</option></select></label>
          </div>
          {block && <label className="sp-field"><span>Reason</span><input placeholder="Lunch, admin, holiday…" /></label>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {mode === "edit" && <button className="sp-btn ghost danger" onClick={onDelete}>Cancel appt</button>}
            <button className="sp-btn primary" style={{ flex: 1 }} onClick={() => onSave({ client, staff, time, block })}>{mode === "edit" ? "Save changes" : block ? "Block time" : "Add appointment"}</button>
          </div>
        </div>
      </>
    );
  }

  // ---------- Clients (list + profile with history + notes) ----------
  const CLIENTS = [
    { id: "c1", name: "Sara M.", av: STAFF[0].av, phone: "+248 251 8842", visits: 12, spend: 640, loyalty: "5/6", note: "Prefers Aline. Sensitive skin — no strong oils.", history: [["Coconut & frangipani massage", "€55", "3 Jul"], ["Signature Creole facial", "€48", "12 Jun"], ["Hot stone therapy", "€65", "28 May"]] },
    { id: "c2", name: "James O.", av: STAFF[1].av, phone: "+248 271 4410", visits: 6, spend: 180, loyalty: "3/10", note: "Always books Denis. Skin fade, no product.", history: [["Skin fade & beard", "€28", "2 Jul"], ["Classic cut", "€20", "5 Jun"]] },
    { id: "c3", name: "Nadia R.", av: STAFF[2].av, phone: "+248 259 1173", visits: 9, spend: 312, loyalty: "8/8 · reward due", note: "Gel manicure, loves nail art.", history: [["BIAB overlay", "€42", "1 Jul"], ["Gel manicure", "€30", "10 Jun"]] },
  ];
  function ClientsPanel({ onOpen }) {
    return (
      <div className="sp-config" style={{ gridTemplateColumns: "1fr" }}>
        <div className="cfg">
          <h3>Clients</h3><p>Everyone who's booked with you.</p>
          {CLIENTS.map((c) => (
            <div className="cfg-row" key={c.id} style={{ cursor: "pointer" }} onClick={() => onOpen(c)}>
              <span className="k" style={{ display: "flex", alignItems: "center", gap: 10 }}><img src={c.av} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />{c.name}</span>
              <span className="v">{c.visits} visits · €{c.spend} <Ic name="chevronRight" size={16} color="var(--cocoa-40)" /></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function ClientSheet({ c, onClose }) {
    const [note, setNote] = useState(c.note);
    return (
      <>
        <div className="sp-scrim" onClick={onClose} />
        <div className="sp-sheet">
          <div className="sp-sheet-grab" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src={c.av} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
            <div><div className="sp-sheet-title" style={{ margin: 0 }}>{c.name}</div><div style={{ fontSize: "0.82rem", color: "var(--cocoa-60)" }}>{c.phone}</div></div>
            <span className="tagpill loyal" style={{ marginLeft: "auto" }}><Ic name="star" size={12} color="var(--clay)" fill="var(--clay)" /> {c.loyalty}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div className="sp-kpi" style={{ flex: 1 }}><div className="n">{c.visits}</div><div className="l">visits</div></div>
            <div className="sp-kpi" style={{ flex: 1 }}><div className="n">€{c.spend}</div><div className="l">lifetime</div></div>
          </div>
          <label className="sp-field"><span>Private note</span><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} /></label>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cocoa-40)", margin: "10px 0 6px" }}>History</div>
          {c.history.map((h, i) => <div className="cfg-row" key={i}><span className="k">{h[0]}</span><span className="v">{h[1]} · {h[2]}</span></div>)}
          <button className="sp-btn primary" style={{ width: "100%", marginTop: 12 }} onClick={onClose}>Done</button>
        </div>
      </>
    );
  }

  // ---------- Marketing ----------
  function MarketingPanel() {
    return (
      <div className="sp-config">
        <div className="cfg">
          <h3>Promotions</h3><p>Fill quiet hours and reward regulars.</p>
          <div className="cfg-row"><span className="k">Happy hour · 20% off</span><span className="v">Mon–Thu, 14–16h · <b style={{ color: "var(--eucalyptus)" }}>Live</b></span></div>
          <div className="cfg-row"><span className="k">First visit · €10 off</span><span className="v">New clients · <b style={{ color: "var(--eucalyptus)" }}>Live</b></span></div>
          <div className="cfg-row"><span className="k">Bring a friend</span><span className="v">Both get €5 · Draft</span></div>
          <button className="sp-btn primary" style={{ width: "100%", marginTop: 12 }}>+ New promotion</button>
        </div>
        <div className="cfg">
          <h3>Discount codes</h3><p>Share on Instagram or with regulars.</p>
          <div className="cfg-row"><span className="k">ISLAND15</span><span className="v">15% off · 42 used</span></div>
          <div className="cfg-row"><span className="k">WELCOME</span><span className="v">€10 off · 128 used</span></div>
          <button className="sp-btn ghost" style={{ width: "100%", marginTop: 12 }}>+ Create code</button>
        </div>
        <div className="cfg">
          <h3>Message blast</h3><p>Reach your clients by push / SMS.</p>
          <div className="cfg-row"><span className="k">Audience</span><span className="v">All clients · 312</span></div>
          <div className="cfg-row"><span className="k">Last sent</span><span className="v">"Weekend slots open" · 2d ago</span></div>
          <button className="sp-btn primary" style={{ width: "100%", marginTop: 12 }}>Compose blast</button>
        </div>
      </div>
    );
  }

  // ---------- Onboarding (first-run wizard) ----------
  function Onboarding({ onClose }) {
    const [step, setStep] = useState(0);
    const steps = [
      { t: "Add your services", d: "List what clients can book and set prices. Import from your current menu.", ic: "sparkle" },
      { t: "Add your team", d: "Invite staff and set their roles and working hours.", ic: "star" },
      { t: "Set opening hours", d: "When are you open? Add breaks and days off.", ic: "clock" },
      { t: "Import Google reviews", d: "Connect your Google Business profile to show your reviews.", ic: "shield" },
    ];
    const s = steps[step];
    return (
      <>
        <div className="sp-scrim" onClick={onClose} />
        <div className="sp-sheet">
          <div className="sp-sheet-grab" />
          <div className="stepdots" style={{ marginBottom: 16 }}>{steps.map((_, i) => <span key={i} className={"stepdot" + (i <= step ? " is-on" : "")} />)}</div>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--shell-alt)", display: "grid", placeItems: "center", marginBottom: 12 }}><Ic name={s.ic} size={26} /></div>
          <div className="sp-sheet-title">{s.t}</div>
          <p style={{ color: "var(--cocoa-60)", margin: "0 0 16px", fontSize: "0.92rem" }}>{s.d}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="sp-btn ghost" onClick={onClose}>Skip setup</button>
            <button className="sp-btn primary" style={{ flex: 1 }} onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}>{step < steps.length - 1 ? "Next" : "Finish — go live"}</button>
          </div>
        </div>
      </>
    );
  }

  // ---------- Shell ----------
  function SalonPanel() {
    const [checked, setChecked] = useState([]);
    const [toast, setToast] = useState(null);
    const [view, setView] = useState("calendar"); // desktop nav
    const [appts, setAppts] = useState(APPTS.filter((a) => a.staff === "a" || a.staff === "d")); // My day = today's staff on shift (subset)
    const [sheet, setSheet] = useState(null); // {kind:'new'|'edit'|'block', appt?}
    const [client, setClient] = useState(null);
    const [onboard, setOnboard] = useState(false);

    const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 1600); };
    function onAction(kind, id) {
      if (kind === "check") { setChecked((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]); }
      else if (kind === "cancel") { setAppts((a) => a.filter((x) => x.id !== id)); flash("Appointment cancelled — client notified"); }
      else if (kind === "reschedule") { setSheet({ kind: "edit", appt: appts.find((a) => a.id === id) }); }
    }

    const nav = [["calendar", "calendar", "Calendar"], ["config", "sparkle", "Services"], ["clients", "heart", "Clients"], ["marketing", "star", "Marketing"], ["reviews", "shield", "Reviews"], ["stats", "shield", "Insights"]];
    const kpis = [["12", "today's bookings"], ["€640", "expected"], ["2", "gaps to fill"], ["4", "staff on shift"]];

    return (
      <div className="sp">
        <div className="sp-top">
          <div className="sp-brand"><b>sey.la</b><span>|</span><i>book</i></div>
          <span className="sp-badge">Studio</span>
          <div className="sp-spacer" />
          <button className="sp-icbtn" aria-label="Notifications"><Ic name="calendar" size={18} /></button>
          <img className="sp-avatar" src={U+"1600334129128-685c5582fd35"+q} alt="Kreol Spa" />
        </div>

        <div className="sp-body">
          {/* desktop side nav */}
          <aside className="sp-side">
            <div className="sp-navsec">Kreol Spa · Beau Vallon</div>
            {nav.map((n) => (
              <div key={n[0]} className={"sp-navitem" + (view === n[0] ? " is-active" : "")} onClick={() => setView(n[0])}>
                <Ic name={n[1]} size={19} color={view === n[0] ? "var(--cream)" : "var(--ink)"} /> {n[2]}
              </div>
            ))}
            <div className="sp-navsec">Account</div>
            <div className="sp-navitem" onClick={() => setOnboard(true)}><Ic name="sparkle" size={19} /> Finish setup</div>
            <div className="sp-navitem"><Ic name="pin" size={19} /> Your page</div>
            <div className="sp-navitem"><Ic name="shield" size={19} /> Subscription</div>
          </aside>

          <main className="sp-main">
            {/* date bar + KPIs (shared) */}
            <div className="sp-datebar">
              <div className="sp-daynav"><button aria-label="Prev"><Ic name="chevronDown" size={16} style={{ transform: "rotate(90deg)" }} /></button><button aria-label="Next"><Ic name="chevronRight" size={16} /></button></div>
              <h1>Today · Thu 3 Jul</h1>
            </div>
            <div className="sp-kpis">
              {kpis.map((k) => <div className="sp-kpi" key={k[1]}><div className="n">{k[0]}</div><div className="l">{k[1]}</div></div>)}
            </div>

            {/* MOBILE: My day agenda */}
            <Agenda appts={appts} onAction={onAction} checked={checked} />

            {/* DESKTOP: view switch */}
            <div className={"sp-view sp-view--calendar" + (view === "calendar" ? " is-shown" : "")}><Swimlane /></div>
            <div className={"sp-view sp-view--config" + (view === "config" ? " is-shown" : "")}><ConfigPanels /></div>
            <div className={"sp-view sp-view--reviews" + (view === "reviews" ? " is-shown" : "")}><ConfigPanels /></div>
            <div className={"sp-view sp-view--stats" + (view === "stats" ? " is-shown" : "")}><ConfigPanels /></div>
            <div className={"sp-view sp-view--clients" + (view === "clients" ? " is-shown" : "")}><ClientsPanel onOpen={setClient} /></div>
            <div className={"sp-view sp-view--marketing" + (view === "marketing" ? " is-shown" : "")}><MarketingPanel /></div>
          </main>
        </div>

        {/* mobile bottom action bar */}
        <div className="sp-fab">
          <button className="ghost" aria-label="Search"><Ic name="search" size={20} /></button>
          <button className="primary" onClick={() => setSheet({ kind: "new" })}>+ New appointment</button>
        </div>

        {toast && <div className="toast" style={{ position: "fixed", bottom: 84 }}>{toast}</div>}
        {sheet && <ApptSheet mode={sheet.kind} appt={sheet.appt} onClose={() => setSheet(null)} onSave={() => { setSheet(null); flash(sheet.kind === "edit" ? "Appointment updated" : "Appointment added"); }} onDelete={() => { setAppts((a) => a.filter((x) => x.id !== sheet.appt.id)); setSheet(null); flash("Appointment cancelled — client notified"); }} />}
        {client && <ClientSheet c={client} onClose={() => setClient(null)} />}
        {onboard && <Onboarding onClose={() => setOnboard(false)} />}
      </div>
    );
  }

export default SalonPanel;
