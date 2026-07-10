// sey.la | book — mobile PWA. Full client app: discover, search+map, studio profile,
// booking flow, classes, bookings, favourites, account/OTP, notifications.
(function () {
  const { Ic, Stars } = window.SEY_UI;
  const D = window.SEY_DATA;
  const { useState, useEffect, useRef } = React;

  // ---------- persistence ----------
  const load = (k, f) => { try { return JSON.parse(localStorage.getItem("sey." + k)) ?? f; } catch { return f; } };
  const save = (k, v) => { try { localStorage.setItem("sey." + k, JSON.stringify(v)); } catch {} };

  // ---------- small pieces ----------
  function TopBar({ title, onBack, right, brand }) {
    return (
      <div className="topbar">
        {onBack && <button className="iconbtn iconbtn--plain topbar-back" onClick={onBack} aria-label="Back"><Ic name="back" /></button>}
        {brand ? (
          <div className="brand"><b>sey.la</b><span>|</span><i>book</i></div>
        ) : (
          <div className="topbar-title">{title}</div>
        )}
        <div className="topbar-spacer" />
        {right}
      </div>
    );
  }

  function StudioCard({ s, onOpen, fav, onFav, wide }) {
    return (
      <button className="scard" onClick={onOpen}>
        <div className="scard-photo">
          <img src={s.photo} alt={s.name} loading="lazy" />
          <span className="scard-tag">{s.tag}</span>
          <span className={"scard-fav" + (fav ? " is-on" : "")} role="button" aria-label="Save"
            onClick={(ev) => { ev.stopPropagation(); onFav(s.id); }}>
            <Ic name="heart" size={18} fill={fav ? "var(--clay)" : "none"} color={fav ? "var(--clay)" : "var(--ink)"} />
          </span>
        </div>
        <div className="scard-body">
          <div className="scard-row">
            <span className="scard-name">{s.name}</span>
            <Stars r={s.rating} />
          </div>
          <div className="scard-meta">
            <Ic name="pin" size={13} color="var(--cocoa-40)" />{s.area}
            {s.distance ? <React.Fragment><i className="dotsep" />{s.distance}</React.Fragment> : null}
          </div>
        </div>
      </button>
    );
  }

  function ClassCard({ c, onJoin, joined }) {
    const pct = Math.round(((c.cap - c.spots) / c.cap) * 100);
    const low = c.spots <= 3;
    return (
      <div className="class">
        <div className="class-top">
          <div className="class-time">
            <div className="t">{c.time}</div>
            <div className="d">{c.day}</div>
          </div>
          <div className="class-info">
            <div className="scard-name">{c.name}</div>
            <div className="srv-meta">{c.studio} · {c.instructor}</div>
            <div className="scard-meta">{c.dur}<i className="dotsep" />{c.level}<i className="dotsep" />SCR {c.price}</div>
          </div>
        </div>
        <div className={"spots" + (low ? " spots--low" : "")}><i style={{ width: pct + "%" }} /></div>
        <div className="spots-lb">
          <span className="muted"><b>{c.spots} spots</b> left of {c.cap}</span>
          <button className={"srv-add" + (joined ? " is-on" : "")} onClick={() => onJoin(c)}>
            {joined ? "Joined ✓" : "Join class"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- HOME ----------
  function Home({ nav, favs, toggleFav, setTab, notif }) {
    const near = D.STUDIOS;
    const rec = D.STUDIOS.slice().sort((a, b) => b.rating - a.rating);
    const hasStudios = D.STUDIOS.length > 0;
    return (
      <>
        <TopBar brand right={
          <button className="iconbtn iconbtn--plain bell" aria-label="Notifications" onClick={() => nav.push("notif")}>
            <Ic name="bell" />{notif && <span className="dot" />}
          </button>
        } />
        <div className="app-scroll">
          <div className="screen">
            <div className="block--flush fu">
              <div className="eyebrow" style={{ marginBottom: 6 }}>Mahé · Praslin · La Digue</div>
              <h1 className="h-xl">Book your island ritual.</h1>
            </div>
            <div className="block--flush">
              <button className="searchfield" onClick={() => setTab("search")}>
                <Ic name="search" size={20} color="var(--cocoa-60)" />
                Studios, services, treatments…
              </button>
            </div>

            <div className="block">
              <div className="catrail">
                {D.CATEGORIES.map((c) => (
                  <button key={c.id} className="cat" onClick={() => nav.push("search", { cat: c.id })}>
                    <span className="cat-ic"><Ic name={c.icon} size={26} /></span>
                    <span className="cat-lb">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {hasStudios ? (
            <>
            <div className="block">
              <div className="sec-title"><h2 className="h-md">Recommended</h2><a onClick={() => setTab("search")}>See all</a></div>
              <div className="hscroll">
                {rec.map((s) => <StudioCard key={s.id} s={s} wide onOpen={() => nav.push("studio", { id: s.id })} fav={favs.includes(s.id)} onFav={toggleFav} />)}
              </div>
            </div>

            <div className="block">
              <div className="sec-title"><h2 className="h-md">Near you</h2><a onClick={() => setTab("search")}>Map</a></div>
              <div className="slist">
                {near.map((s) => <StudioCard key={s.id} s={s} onOpen={() => nav.push("studio", { id: s.id })} fav={favs.includes(s.id)} onFav={toggleFav} />)}
              </div>
            </div>
            </>
            ) : (
            <div className="block">
              <div className="empty">
                <div className="empty-ic"><Ic name="spa" size={26} /></div>
                <div className="h-md">No studios yet</div>
                <p className="muted" style={{ margin: "6px 0 0" }}>We're onboarding salons across Mahé, Praslin &amp; La Digue. Check back soon.</p>
              </div>
            </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ---------- SEARCH (+ filters + map) ----------
  function Search({ nav, favs, toggleFav, initialCat }) {
    const [cat, setCat] = useState(initialCat || "all");
    const [mode, setMode] = useState("list"); // list | map
    const [active, setActive] = useState(null);
    const list = cat === "all" ? D.STUDIOS : D.STUDIOS.filter((s) => s.cat === cat);
    const cats = [{ id: "all", label: "All" }].concat(D.CATEGORIES.map((c) => ({ id: c.id, label: c.label })));
    return (
      <>
        <TopBar title="Browse" right={
          <button className="iconbtn iconbtn--plain" onClick={() => setMode(mode === "list" ? "map" : "list")} aria-label="Toggle map">
            <Ic name={mode === "list" ? "pin" : "filter"} />
          </button>
        } />
        <div className="screen" style={{ paddingTop: 4, paddingBottom: 10 }}>
          <button className="searchfield" onClick={() => {}}>
            <Ic name="search" size={20} color="var(--cocoa-60)" />
            <input placeholder="Search Beau Vallon…" onClick={(e) => e.stopPropagation()} />
          </button>
          <div className="chips" style={{ marginTop: 12 }}>
            {cats.map((c) => (
              <button key={c.id} className={"chip" + (cat === c.id ? " is-active" : "")} onClick={() => setCat(c.id)}>{c.label}</button>
            ))}
          </div>
        </div>

        {mode === "list" ? (
          <div className="app-scroll" style={{ paddingTop: 4 }}>
            <div className="screen">
              <div className="muted tiny" style={{ margin: "2px 0 12px" }}>{list.length} studios · sorted by rating</div>
              <div className="slist">
                {list.map((s) => <StudioCard key={s.id} s={s} onOpen={() => nav.push("studio", { id: s.id })} fav={favs.includes(s.id)} onFav={toggleFav} />)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, position: "relative" }}>
            <div className="map">
              <div className="map-water" />
              <div className="map-road" style={{ left: "20%", top: 0, width: 3, height: "100%" }} />
              <div className="map-road" style={{ left: 0, top: "48%", width: "100%", height: 3 }} />
              {list.map((s) => (
                <div key={s.id} className={"pin-marker" + (active === s.id ? " is-active" : "")} style={{ left: s.x + "%", top: s.y + "%" }} onClick={() => setActive(s.id)}>
                  <span className="pin-price">★ {s.rating}</span>
                </div>
              ))}
            </div>
            {active && (() => { const s = list.find((x) => x.id === active) || D.STUDIOS.find((x) => x.id === active); return (
              <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
                <StudioCard s={s} onOpen={() => nav.push("studio", { id: s.id })} fav={favs.includes(s.id)} onFav={toggleFav} />
              </div>
            ); })()}
          </div>
        )}
      </>
    );
  }

  // ---------- STUDIO PROFILE ----------
  function Studio({ id, nav, favs, toggleFav }) {
    const s = D.STUDIOS.find((x) => x.id === id);
    const classes = D.CLASSES.filter((c) => c.studioId === id);
    const [tab, setTab] = useState("services");
    return (
      <div className="sheet-full">
        <div style={{ position: "relative" }}>
          <img src={s.photo.replace("w=600", "w=800")} alt={s.name} style={{ width: "100%", height: 230, objectFit: "cover", filter: "var(--photo-filter)" }} />
          <button className="iconbtn topbar-back" style={{ position: "absolute", top: 14, left: 14 }} onClick={nav.pop} aria-label="Back"><Ic name="back" /></button>
          <button className="iconbtn" style={{ position: "absolute", top: 14, right: 14 }} aria-label="Share"><Ic name="share" size={19} /></button>
          <button className="iconbtn" style={{ position: "absolute", top: 14, right: 66 }} onClick={() => toggleFav(s.id)} aria-label="Save">
            <Ic name="heart" size={19} fill={favs.includes(s.id) ? "var(--clay)" : "none"} color={favs.includes(s.id) ? "var(--clay)" : "var(--ink)"} />
          </button>
        </div>
        <div className="app-scroll" style={{ paddingBottom: 100 }}>
          <div className="screen" style={{ paddingTop: 16 }}>
            <span className="scard-tag" style={{ position: "static", display: "inline-block", marginBottom: 8 }}>{s.tag}</span>
            <h1 className="h-lg">{s.name}</h1>
            <div className="scard-meta" style={{ marginTop: 8, fontSize: "0.9rem" }}>
              <Stars r={s.rating} /> <b style={{ color: "var(--ink)" }}>{s.rating}</b> ({s.reviews})
              <i className="dotsep" /><Ic name="pin" size={13} color="var(--cocoa-40)" />{s.area}
            </div>
            <p className="muted" style={{ marginTop: 12, lineHeight: 1.55 }}>{s.about}</p>

            <div className="chips" style={{ marginTop: 6, marginBottom: 4 }}>
              {["services", classes.length ? "classes" : null, (s.reviews_list && s.reviews_list.length) ? "reviews" : null, "about"].filter(Boolean).map((t) => (
                <button key={t} className={"chip" + (tab === t ? " is-active" : "")} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>

            {tab === "services" && s.services.map((g) => (
              <div className="block--flush" key={g.g}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{g.g}</div>
                {g.items.map((it) => (
                  <div className="srv" key={it.id} onClick={() => nav.push("book", { id: s.id, serviceId: it.id })}>
                    <div>
                      <div className="srv-name">{it.name}</div>
                      <div className="srv-meta">{it.dur}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="srv-price">SCR {it.price}</span>
                      <Ic name="chevronRight" size={18} color="var(--cocoa-40)" />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {tab === "classes" && (
              <div className="block--flush" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {classes.map((c) => <ClassCard key={c.id} c={c} joined={false} onJoin={(cl) => nav.push("classJoin", { id: cl.id })} />)}
              </div>
            )}

            {tab === "reviews" && (
              <div className="block--flush">
                {(s.reviews_list || []).map((r, i) => (
                  <div className="review" key={i}>
                    <div className="review-head">
                      {r.av
                        ? <img className="review-av" src={r.av} alt="" />
                        : <span className="review-av" style={{ display: "grid", placeItems: "center", background: "var(--blush)", color: "var(--clay)", fontWeight: 700 }}>{(r.name || "G").slice(0, 1).toUpperCase()}</span>}
                      <div style={{ flex: 1 }}><b>{r.name}</b><div className="tiny muted">{r.when}</div></div>
                      <span className="rating"><Ic name="star" size={13} fill="var(--ink)" color="var(--ink)" /> {r.rating}.0</span>
                    </div>
                    <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "about" && (
              <div className="block--flush">
                <div className="eyebrow" style={{ marginBottom: 8 }}>Opening hours</div>
                {s.hours.map((h, i) => (
                  <div className={"hours-row" + (i === s.todayIdx ? " today" : "")} key={h[0]}>
                    <span>{h[0]}{i === s.todayIdx ? " · Today" : ""}</span><span>{h[1]}</span>
                  </div>
                ))}
                <div className="eyebrow" style={{ margin: "18px 0 8px" }}>Gallery</div>
                <div className="gallery">{s.gallery.map((g, i) => <img key={i} src={g} alt="" loading="lazy" />)}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))", background: "color-mix(in srgb, var(--surface) 94%, transparent)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--line)" }}>
          <button className="btn btn--primary btn--full" onClick={() => nav.push("book", { id: s.id })}>Book now</button>
        </div>
      </div>
    );
  }

  // Real bookable times for a studio on a given weekday (Mon=0..Sun=6), derived
  // from the studio's opening hours. Every 30 min inside the open window; empty
  // when the studio is closed that day. A real conflict is still validated by
  // /api/book on submit — this just stops us inventing availability.
  const SLOT_DOWLBL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function slotsForDay(s, dow) {
    if (dow == null) return [];
    const row = (s.hours || []).find((h) => h[0] === SLOT_DOWLBL[dow]);
    if (!row) return [];
    const m = String(row[1]).match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
    if (!m) return [];
    const pad = (n) => String(n).padStart(2, "0");
    const start = (+m[1]) * 60 + (+m[2]);
    const end = (+m[3]) * 60 + (+m[4]);
    const out = [];
    for (let t = start; t + 30 <= end; t += 30) out.push(pad(Math.floor(t / 60)) + ":" + pad(t % 60));
    return out;
  }

  // ---------- BOOKING FLOW (service -> staff -> time -> payment -> confirm) ----------
  function BookFlow({ id, serviceId, nav, addBooking, prefill }) {
    const s = D.STUDIOS.find((x) => x.id === id);
    const allItems = s.services.flatMap((g) => g.items);
    const staffPool = (s.staff && s.staff.length) ? s.staff : D.STAFF.slice(0, 3);
    const [picked, setPicked] = useState(serviceId ? [serviceId] : (prefill ? prefill.picked : []));
    const [staff, setStaff] = useState("any");
    const [day, setDay] = useState(0);
    const [slot, setSlot] = useState(null);
    const [recurring, setRecurring] = useState(false);
    const [pay, setPay] = useState("salon"); // salon | now
    const [step, setStep] = useState(serviceId || prefill ? 1 : 0); // 0 svc,1 staff,2 time,3 pay
    const [done, setDone] = useState(false);

    const chosen = allItems.filter((it) => picked.includes(it.id));
    const total = chosen.reduce((n, it) => n + it.price, 0);
    const deposit = pay === "now" ? Math.max(5, Math.round(total * 0.2)) : 0;
    const staffName = staff === "any" ? "Any professional" : (staffPool.find((p) => p.id === staff) || {}).name;
    const TITLES = ["Choose services", "Choose professional", "Pick a time", "Payment"];

    function confirm() {
      // Instant local booking — offline/demo fallback + drives the PWA "My bookings" list.
      addBooking({
        id: "bk" + Date.now(), studioId: s.id, studio: s.name, area: s.area,
        service: chosen.map((c) => c.name).join(", ") || "Appointment",
        staff: staffName, pay, deposit, recurring,
        when: (D.DAYS[day].d === "Today" ? "Today" : D.DAYS[day].d) + " · " + slot,
        price: total, status: "Confirmed", photo: s.photo, past: false,
      });
      setDone(true);
      // Best-effort real write to Supabase (+ Brevo confirmation email) via /api/book.
      // Needs a live session (shared from the site login); silently no-ops otherwise.
      try {
        if (window.SEY_BOOK && s.dbId) {
          const first = chosen.find((c) => c.sid) || null;
          // Interpret the picked day + slot as MAHÉ local time (UTC+4, no DST),
          // not the visitor's browser timezone.
          const now = new Date();
          const when = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day);
          const parts = (slot || "09:00").split(":");
          const pad = (n) => String(n).padStart(2, "0");
          const mahe = when.getFullYear() + "-" + pad(when.getMonth() + 1) + "-" + pad(when.getDate())
            + "T" + pad(Number(parts[0]) || 9) + ":" + pad(Number(parts[1]) || 0) + ":00+04:00";
          const realStaff = (staff !== "any" && s.staff && s.staff.some((p) => p.id === staff)) ? staff : null;
          window.SEY_BOOK.createBooking({
            studioDbId: s.dbId,
            serviceDbId: first ? first.sid : null,
            staffId: realStaff,
            startsAt: new Date(mahe).toISOString(),
            durationMin: first ? first.durMin : 60,
            priceEur: total,
          });
        }
      } catch (e) { /* keep the local booking; never break the UI */ }
    }

    if (done) {
      return (
        <div className="sheet-full">
          <div className="app-scroll">
            <div className="confirm">
              <div className="confirm-ic"><Ic name="check" size={38} color="var(--eucalyptus)" /></div>
              <h1 className="h-lg">You're booked</h1>
              <p className="muted" style={{ margin: 0 }}>A confirmation is on its way. Free to cancel up to 12h before.</p>
              <div className="receipt">
                <div className="receipt-row"><span className="k">Studio</span><span className="v">{s.name}</span></div>
                <div className="receipt-row"><span className="k">Service</span><span className="v">{chosen.map((c) => c.name).join(", ")}</span></div>
                <div className="receipt-row"><span className="k">With</span><span className="v">{staffName}</span></div>
                <div className="receipt-row"><span className="k">When</span><span className="v">{D.DAYS[day].d} · {slot}{recurring ? " · repeats" : ""}</span></div>
                <div className="receipt-row"><span className="k">Payment</span><span className="v">{pay === "now" ? "SCR " + deposit + " deposit paid" : "Pay in salon"}</span></div>
                <div className="receipt-row"><span className="k">Total</span><span className="v">SCR {total}</span></div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}>
            <button className="btn btn--primary btn--full" onClick={() => nav.reset("bookings")}>View my bookings</button>
          </div>
        </div>
      );
    }

    return (
      <div className="sheet-full">
        <TopBar title={TITLES[step]} onBack={step === 0 ? nav.pop : () => setStep(step - 1)} />
        <div className="app-scroll" style={{ paddingBottom: 118 }}>
          <div className="screen">
            <div className="stepdots">{[0,1,2,3].map((i) => <span key={i} className={"stepdot" + (i <= step ? " is-on" : "")} />)}</div>
            <div className="muted tiny" style={{ marginBottom: 4 }}>{s.name} · {s.area}</div>

            {step === 0 && s.services.map((g) => (
              <div className="block--flush" key={g.g}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{g.g}</div>
                {g.items.map((it) => {
                  const on = picked.includes(it.id);
                  return (
                    <div className="srv" key={it.id}>
                      <div><div className="srv-name">{it.name}</div><div className="srv-meta">{it.dur} · SCR {it.price}</div></div>
                      <button className={"srv-add" + (on ? " is-on" : "")} onClick={() => setPicked(on ? picked.filter((p) => p !== it.id) : [...picked, it.id])}>{on ? "Added ✓" : "Add"}</button>
                    </div>
                  );
                })}
              </div>
            ))}

            {step === 1 && (
              <div className="block--flush">
                <button className={"staffcard" + (staff === "any" ? " is-on" : "")} onClick={() => setStaff("any")}>
                  <span className="staff-any"><Ic name="sparkle" size={20} color="var(--ink)" /></span>
                  <div style={{ flex: 1 }}><div className="appt-name">Any professional</div><div className="srv-meta">Earliest availability</div></div>
                  {staff === "any" && <Ic name="check" size={18} color="var(--ink)" />}
                </button>
                {staffPool.map((p) => (
                  <button key={p.id} className={"staffcard" + (staff === p.id ? " is-on" : "")} onClick={() => setStaff(p.id)}>
                    {p.av ? <img src={p.av} alt="" /> : <span className="staff-any">{(p.name || "?").slice(0, 1).toUpperCase()}</span>}
                    <div style={{ flex: 1 }}><div className="appt-name">{p.name}</div>{p.role && <div className="srv-meta">{p.role}</div>}</div>
                    {p.rating ? <span className="rating" style={{ marginRight: 6 }}><Ic name="star" size={13} fill="var(--ink)" color="var(--ink)" /> {p.rating}</span> : null}
                    {staff === p.id && <Ic name="check" size={18} color="var(--ink)" />}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="block--flush">
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Day{staff !== "any" ? " · " + staffName + "'s calendar" : ""}</div>
                  <div className="daystrip">
                    {D.DAYS.map((d, i) => (
                      <button key={i} className={"day" + (day === i ? " is-active" : "")} onClick={() => { setDay(i); setSlot(null); }}>
                        <div className="day-d">{d.d}</div><div className="day-n">{d.n}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="block--flush">
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Available times</div>
                  {(() => {
                    const times = slotsForDay(s, (D.DAYS[day] || {}).dow);
                    if (!times.length) return <p className="muted" style={{ margin: 0 }}>Closed on this day — pick another.</p>;
                    return (
                      <div className="slotgrid">
                        {times.map((t) => (
                          <button key={t} className={"slot" + (slot === t ? " is-active" : "")} onClick={() => setSlot(t)}>{t}</button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <label className="togglerow">
                  <div><div className="srv-name">Repeat this appointment</div><div className="srv-meta">Every 4 weeks · cancel anytime</div></div>
                  <span className={"switch" + (recurring ? " is-on" : "")} onClick={() => setRecurring(!recurring)}><i /></span>
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <div className="block--flush">
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Payment</div>
                  <button className={"paymethod" + (pay === "salon" ? " is-on" : "")} onClick={() => setPay("salon")}>
                    <span className="arow-ic"><Ic name="pin" size={19} /></span>
                    <div style={{ flex: 1 }}><div className="srv-name">Pay in salon</div><div className="srv-meta">Free booking · pay after your visit</div></div>
                    {pay === "salon" && <Ic name="check" size={18} color="var(--ink)" />}
                  </button>
                  <button className={"paymethod" + (pay === "now" ? " is-on" : "")} onClick={() => setPay("now")}>
                    <span className="arow-ic"><Ic name="card" size={19} /></span>
                    <div style={{ flex: 1 }}><div className="srv-name">Pay a deposit now</div><div className="srv-meta">Secures your slot · Visa ···· 4291</div></div>
                    {pay === "now" && <Ic name="check" size={18} color="var(--ink)" />}
                  </button>
                </div>
                <div className="paynote"><Ic name="shield" size={16} color="var(--eucalyptus)" /> {pay === "now" ? "SCR " + deposit + " deposit today, SCR " + (total - deposit) + " in salon. Refundable if you cancel 12h before." : "No card needed. A no-show may limit future free bookings."}</div>
                <div className="receipt" style={{ marginTop: 4 }}>
                  <div className="receipt-row"><span className="k">{chosen.length} service{chosen.length > 1 ? "s" : ""}</span><span className="v">SCR {total}</span></div>
                  <div className="receipt-row"><span className="k">With</span><span className="v">{staffName}</span></div>
                  <div className="receipt-row"><span className="k">When</span><span className="v">{D.DAYS[day].d} · {slot}</span></div>
                  {deposit > 0 && <div className="receipt-row"><span className="k">Due now</span><span className="v">SCR {deposit}</span></div>}
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))", background: "color-mix(in srgb, var(--surface) 94%, transparent)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--line)" }}>
          {step === 0 && <button className="btn btn--primary btn--full" disabled={!picked.length} onClick={() => setStep(1)}>Continue{total ? " · SCR " + total : ""}</button>}
          {step === 1 && <button className="btn btn--primary btn--full" onClick={() => setStep(2)}>Continue</button>}
          {step === 2 && <button className="btn btn--primary btn--full" disabled={!slot} onClick={() => setStep(3)}>Continue {slot ? "· " + D.DAYS[day].d + " " + slot : ""}</button>}
          {step === 3 && <button className="btn btn--primary btn--full" onClick={confirm}>{pay === "now" ? "Pay SCR " + deposit + " & confirm" : "Confirm booking"}</button>}
        </div>
      </div>
    );
  }

  // ---------- CLASS JOIN ----------
  function ClassJoin({ id, nav, joinClass, joinedIds }) {
    const c = D.CLASSES.find((x) => x.id === id);
    const joined = joinedIds.includes(c.id);
    const pct = Math.round(((c.cap - c.spots) / c.cap) * 100);
    return (
      <div className="sheet-full">
        <TopBar title="Group class" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen">
            <h1 className="h-lg" style={{ marginTop: 8 }}>{c.name}</h1>
            <div className="muted" style={{ marginTop: 6 }}>{c.studio} · {c.instructor}</div>
            <div className="receipt" style={{ marginTop: 18 }}>
              <div className="receipt-row"><span className="k">When</span><span className="v">{c.day} · {c.time}</span></div>
              <div className="receipt-row"><span className="k">Duration</span><span className="v">{c.dur}</span></div>
              <div className="receipt-row"><span className="k">Level</span><span className="v">{c.level}</span></div>
              <div className="receipt-row"><span className="k">Price</span><span className="v">SCR {c.price}</span></div>
            </div>
            <div className="block--flush">
              <div className={"spots" + (c.spots <= 3 ? " spots--low" : "")}><i style={{ width: pct + "%" }} /></div>
              <div className="spots-lb"><span className="muted"><b>{c.spots} spots</b> left of {c.cap}</span><span className="muted">{pct}% full</span></div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}>
          <button className="btn btn--primary btn--full" disabled={joined} onClick={() => { joinClass(c); nav.pop(); }}>
            {joined ? "Already joined ✓" : "Join class · SCR " + c.price}
          </button>
        </div>
      </div>
    );
  }

  // ---------- CLASSES LIST ----------
  function Classes({ nav }) {
    return (
      <div className="sheet-full">
        <TopBar title="Group classes" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 6 }}>
            {D.CLASSES.length
              ? D.CLASSES.map((c) => <ClassCard key={c.id} c={c} joined={false} onJoin={(cl) => nav.push("classJoin", { id: cl.id })} />)
              : <div className="empty"><div className="empty-ic"><Ic name="fitness" size={26} /></div><div className="h-md" style={{ marginBottom: 4 }}>No classes yet</div><p className="muted" style={{ margin: 0 }}>Group classes will appear here as studios add them.</p></div>}
          </div>
        </div>
      </div>
    );
  }

  // ---------- BOOKINGS ----------
  function Bookings({ bookings, nav, onManage, reviewed }) {
    const [tab, setTab] = useState("upcoming");
    const up = bookings.filter((b) => !b.past);
    const past = bookings.filter((b) => b.past);
    const list = tab === "upcoming" ? up : past;
    return (
      <>
        <TopBar title="My bookings" />
        <div className="screen" style={{ paddingBottom: 8 }}>
          <div className="chips">
            <button className={"chip" + (tab === "upcoming" ? " is-active" : "")} onClick={() => setTab("upcoming")}>Upcoming ({up.length})</button>
            <button className={"chip" + (tab === "past" ? " is-active" : "")} onClick={() => setTab("past")}>History ({past.length})</button>
          </div>
        </div>
        <div className="app-scroll" style={{ paddingTop: 6 }}>
          <div className="screen" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {list.length === 0 ? (
              <div className="empty">
                <div className="empty-ic"><Ic name="calendar" size={26} /></div>
                <div className="h-md" style={{ marginBottom: 4 }}>Nothing here yet</div>
                <p className="muted" style={{ margin: 0 }}>When you book, it shows up here.</p>
              </div>
            ) : list.map((b) => (
              <div key={b.id}>
                <div className="bk" onClick={() => b.past ? nav.push("studio", { id: b.studioId }) : onManage(b)}>
                  <img className="bk-photo" src={b.photo} alt="" />
                  <div className="bk-info">
                    <div className="bk-when">{b.when}</div>
                    <div className="bk-name">{b.service}</div>
                    <div className="bk-sub">{b.studio} · SCR {b.price}</div>
                  </div>
                  <span className={"status " + (b.past ? "status--past" : "status--ok")}>{b.status}</span>
                </div>
                {b.past && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn btn--soft btn--sm" onClick={() => nav.push("book", { id: b.studioId })}><Ic name="calendar" size={15} /> Book again</button>
                    {reviewed.includes(b.id)
                      ? <div className="tiny muted" style={{ display: "flex", gap: 5, alignItems: "center", alignSelf: "center" }}><Ic name="check" size={14} color="var(--eucalyptus)" /> Reviewed</div>
                      : <button className="btn btn--soft btn--sm" onClick={() => nav.push("review", { bookingId: b.id })}><Ic name="star" size={15} /> Review</button>}
                  </div>
                )}
              </div>
            ))}
            {tab === "upcoming" && up.length > 0 && (
              <div className="muted tiny" style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 4 }}>
                <Ic name="clock" size={14} color="var(--eucalyptus)" /> Tap a booking to reschedule or cancel · free up to 12h before.
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ---------- FAVOURITES ----------
  function Favourites({ favs, toggleFav, nav }) {
    const list = D.STUDIOS.filter((s) => favs.includes(s.id));
    return (
      <div className="sheet-full">
        <TopBar title="Favourites" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen">
            {list.length === 0 ? (
              <div className="empty"><div className="empty-ic"><Ic name="heart" size={26} /></div><div className="h-md" style={{ marginBottom: 4 }}>No favourites yet</div><p className="muted" style={{ margin: 0 }}>Tap the heart on any studio to save it.</p></div>
            ) : (
              <div className="slist">{list.map((s) => <StudioCard key={s.id} s={s} onOpen={() => nav.push("studio", { id: s.id })} fav onFav={toggleFav} />)}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- NOTIFICATIONS ----------
  function Notifications({ nav }) {
    const items = [
      { ic: "calendar", t: "Reminder: Coconut & frangipani massage", s: "Tomorrow at 14:30 · Kreol Spa", when: "2h ago", dot: true },
      { ic: "check", t: "Booking confirmed", s: "Sunrise beach yoga · Sat 07:00", when: "1d ago", dot: true },
      { ic: "sparkle", t: "A slot opened at L'Accent Barber", s: "Today 16:00 — you were watching this", when: "2d ago" },
      { ic: "heart", t: "Lumière Nails added a new service", s: "BIAB overlay · SCR 42", when: "5d ago" },
    ];
    return (
      <div className="sheet-full">
        <TopBar title="Notifications" onBack={nav.pop} right={<button className="iconbtn iconbtn--plain" aria-label="Settings" onClick={() => nav.push("notifsettings")}><Ic name="shield" size={20} /></button>} />
        <div className="app-scroll">
          <div className="screen">
            {items.map((n, i) => (
              <div className="arow" key={i}>
                <span className="arow-ic"><Ic name={n.ic} size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{n.t}</div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>{n.s}</div>
                </div>
                <div className="tiny muted" style={{ whiteSpace: "nowrap" }}>{n.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- ACCOUNT + LOGIN/OTP ----------
  function Account({ user, setUser, favs, nav, notif, setNotif }) {
    if (!user) return <Login onDone={setUser} />;
    const rows = [
      { ic: "sparkle", lb: "Rewards & stamps", go: () => nav.push("rewards") },
      { ic: "calendar", lb: "Messages", go: () => nav.push("messages") },
      { ic: "card", lb: "Packages & gift cards", go: () => nav.push("packages") },
      { ic: "clock", lb: "Waitlist", go: () => nav.push("waitlist") },
      { ic: "heart", lb: "Favourites", go: () => nav.push("favs") },
      { ic: "sparkle", lb: "Invite a studio · €15", go: () => nav.push("invite") },
      { ic: "bell", lb: "Notifications", go: () => nav.push("notif") },
      { ic: "card", lb: "Payment methods", go: () => nav.push("payments") },
      { ic: "globe", lb: "Language · English", go: () => nav.push("language") },
      { ic: "help", lb: "Help & support" },
    ];
    return (
      <>
        <TopBar title="Account" />
        <div className="app-scroll">
          <div className="screen">
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0 18px" }}>
              <img className="avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70" alt="" />
              <div><div className="h-md">{user.name}</div><div className="tiny muted">{user.phone}</div></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "14px", textAlign: "center" }}>
                <div className="h-md">{favs.length}</div><div className="tiny muted">Saved</div>
              </div>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "14px", textAlign: "center" }}>
                <div className="h-md">4.9</div><div className="tiny muted">Your rating</div>
              </div>
            </div>
            <div className="block--flush">
              {rows.map((r) => (
                <div className="arow" key={r.lb} onClick={r.go}>
                  <span className="arow-ic"><Ic name={r.ic} size={20} /></span>
                  <span className="arow-lb">{r.lb}</span>
                  <Ic name="chevronRight" size={18} color="var(--cocoa-40)" />
                </div>
              ))}
              <div className="arow" onClick={() => setNotif(!notif)}>
                <span className="arow-ic"><Ic name="bell" size={20} /></span>
                <span className="arow-lb">Push reminders</span>
                <span style={{ width: 46, height: 28, borderRadius: 999, background: notif ? "var(--ink)" : "var(--line-strong)", position: "relative", transition: "background .2s" }}>
                  <span style={{ position: "absolute", top: 3, left: notif ? 21 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
                </span>
              </div>
            </div>
            <button className="btn btn--soft btn--full" style={{ marginTop: 18 }} onClick={() => { if (window.SEY_BOOK) window.SEY_BOOK.signOut(); setUser(null); }}>
              <Ic name="logout" size={18} /> Log out
            </button>
            <p className="tiny muted" style={{ textAlign: "center", marginTop: 20 }}>sey.la | book · always free for clients<br />Operated by Nexora Consulting LLC</p>
          </div>
        </div>
      </>
    );
  }

  function Login({ onDone }) {
    // Email magic-link login (Supabase). No phone/SMS — we're email-only.
    const [email, setEmail] = useState("");
    const [estate, setEstate] = useState("idle"); // idle | sending | sent | error
    const [emsg, setEmsg] = useState("");
    async function sendLink() {
      const addr = email.trim();
      if (!addr) return;
      setEstate("sending");
      const api = typeof window !== "undefined" && window.SEY_BOOK;
      const res = api ? await window.SEY_BOOK.sendMagicLink(addr) : { error: "supabase_unavailable" };
      if (res && res.ok) { setEstate("sent"); }
      else { setEstate("error"); setEmsg((res && res.error) || "error"); }
    }

    return (
      <div className="app-scroll" style={{ paddingBottom: 24 }}>
        <div className="screen" style={{ paddingTop: 40 }}>
          <div className="brand" style={{ fontSize: "1.4rem", marginBottom: 28 }}><b>sey.la</b><span>|</span><i>book</i></div>
          {estate === "sent" ? (
            <>
              <h1 className="h-lg">Check your email</h1>
              <p className="muted" style={{ marginTop: 8 }}>We sent a magic link to <b>{email.trim()}</b>. Open it on this device to sign in — you'll come right back here.</p>
              <button className="btn btn--soft btn--full" style={{ marginTop: 22 }} onClick={() => setEstate("idle")}>Use a different email</button>
            </>
          ) : (
            <>
              <h1 className="h-lg">Log in or sign up</h1>
              <p className="muted" style={{ marginTop: 8 }}>Enter your email — we'll send a magic link. No password, and booking is always free.</p>
              <div className="field" style={{ marginTop: 22 }}>
                <input type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendLink(); }} />
              </div>
              <button className="btn btn--primary btn--full" style={{ marginTop: 18 }} disabled={estate === "sending" || !email.trim()} onClick={sendLink}>{estate === "sending" ? "Sending…" : "Send magic link"}</button>
              {estate === "error" && <p className="tiny" style={{ color: "var(--clay)", marginTop: 12 }}>Couldn't send the link ({emsg}). Please try again.</p>}
              <p className="tiny muted" style={{ marginTop: 16, lineHeight: 1.5 }}>By continuing you agree to the Terms and Privacy Policy.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------- LOYALTY / REWARDS ----------
  function LoyaltyCard({ l }) {
    const cells = Array.from({ length: l.need }, (_, i) => i);
    return (
      <div className="loy">
        <div className="loy-head">
          <img src={l.photo} alt="" />
          <div style={{ flex: 1 }}>
            <div className="scard-name">{l.studio}</div>
            <div className="loy-progress">{l.have} of {l.need} visits</div>
          </div>
          <Stars r={5} />
        </div>
        <div className="loy-body">
          <div className="stamps">
            {cells.map((i) => {
              const on = i < l.have, reward = i === l.need - 1;
              return (
                <div key={i} className={"stamp" + (on ? " is-on" : "") + (reward && !on ? " is-reward" : "")}>
                  {reward ? <Ic name="sparkle" size={16} color={on ? "#fff" : "var(--clay)"} /> : on ? <Ic name="check" size={15} color="#fff" /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                </div>
              );
            })}
          </div>
          <div className="loy-reward"><Ic name="sparkle" size={16} color="var(--clay)" /> Reward: {l.reward}</div>
        </div>
      </div>
    );
  }

  function Rewards({ nav }) {
    return (
      <div className="sheet-full">
        <TopBar title="Rewards" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 6 }}>
            <p className="muted" style={{ margin: "0 0 2px" }}>Collect a stamp on every visit. Rewards apply automatically at checkout.</p>
            {D.LOYALTY.length
              ? D.LOYALTY.map((l) => <LoyaltyCard key={l.studioId} l={l} />)
              : <div className="empty"><div className="empty-ic"><Ic name="sparkle" size={26} /></div><div className="h-md" style={{ marginBottom: 4 }}>No rewards yet</div><p className="muted" style={{ margin: 0 }}>Book with a studio that runs a loyalty card and your stamps show up here.</p></div>}
          </div>
        </div>
      </div>
    );
  }

  // ---------- POST-VISIT REVIEW ----------
  function ReviewFlow({ booking, nav, onSubmit }) {
    const [r, setR] = useState(5);
    const [txt, setTxt] = useState("");
    const [done, setDone] = useState(false);
    if (done) return (
      <div className="sheet-full">
        <div className="app-scroll"><div className="confirm">
          <div className="confirm-ic"><Ic name="heart" size={34} color="var(--eucalyptus)" fill="var(--eucalyptus)" /></div>
          <h1 className="h-lg">Thank you</h1>
          <p className="muted" style={{ margin: 0 }}>Your review helps other island guests find great studios.</p>
        </div></div>
        <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}>
          <button className="btn btn--primary btn--full" onClick={nav.pop}>Done</button>
        </div>
      </div>
    );
    return (
      <div className="sheet-full">
        <TopBar title="Leave a review" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen" style={{ paddingTop: 8 }}>
            <div className="bk" style={{ cursor: "default" }}>
              <img className="bk-photo" src={booking.photo} alt="" />
              <div className="bk-info"><div className="bk-name">{booking.service}</div><div className="bk-sub">{booking.studio} · {booking.when}</div></div>
            </div>
            <div className="starrow">
              {[1,2,3,4,5].map((n) => (
                <button key={n} className={n <= r ? "is-on" : ""} onClick={() => setR(n)} aria-label={n + " stars"}>
                  <Ic name="star" size={34} fill={n <= r ? "var(--clay)" : "none"} color={n <= r ? "var(--clay)" : "var(--line-strong)"} />
                </button>
              ))}
            </div>
            <textarea className="reviewtext" placeholder="Tell others about your visit (optional)…" value={txt} onChange={(e) => setTxt(e.target.value)} />
          </div>
        </div>
        <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}>
          <button className="btn btn--primary btn--full" onClick={() => { onSubmit(booking.id); setDone(true); }}>Submit review</button>
        </div>
      </div>
    );
  }

  // ---------- INVITE A STUDIO -> WALLET ----------
  function Invite({ nav }) {
    const [copied, setCopied] = useState(false);
    return (
      <div className="sheet-full">
        <TopBar title="Invite a studio" onBack={nav.pop} />
        <div className="app-scroll">
          <div className="screen" style={{ paddingTop: 8 }}>
            <div className="wallet">
              <div className="tiny" style={{ opacity: 0.8 }}>Your wallet</div>
              <div className="wallet-amt">€15</div>
              <div className="tiny" style={{ opacity: 0.8 }}>Credit toward any booking</div>
            </div>
            <div className="block--flush">
              <h2 className="h-md">Know a great studio?</h2>
              <p className="muted" style={{ marginTop: 6 }}>Invite a salon, spa or barber to join sey.la | book. When they go live, you both get <b style={{ color: "var(--ink)" }}>€15</b> in credit.</p>
            </div>
            <div className="block--flush">
              <div className="tiny muted" style={{ marginBottom: 8, fontWeight: 600 }}>Your invite code</div>
              <div className="invite-code">
                AMELIA-15
                <button className="btn btn--sm btn--soft" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied ✓" : "Copy"}</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}>
          <button className="btn btn--primary btn--full"><Ic name="share" size={18} color="var(--cream)" /> Share invite</button>
        </div>
      </div>
    );
  }

  // ---------- BOOKING ACTION SHEET (cancel / reschedule) ----------
  function BookingActions({ booking, onClose, onCancel, onReschedule, onViewStudio }) {
    return (
      <>
        <div className="sheet-scrim" onClick={onClose} />
        <div className="sheet actionsheet">
          <div className="sheet-grab" />
          <div style={{ padding: "0 4px 8px" }}>
            <div className="bk-when">{booking.when}</div>
            <div className="bk-name">{booking.service}</div>
            <div className="bk-sub muted">{booking.studio}</div>
          </div>
          <button className="act" onClick={onReschedule}><span className="act-ic"><Ic name="calendar" size={20} /></span>Reschedule</button>
          <button className="act" onClick={onViewStudio}><span className="act-ic"><Ic name="pin" size={20} /></span>View studio</button>
          <button className="act danger" onClick={onCancel}><span className="act-ic" style={{ background: "var(--blush)" }}><Ic name="close" size={19} color="var(--clay)" /></span>Cancel booking</button>
          <button className="btn btn--soft btn--full" style={{ marginTop: 12 }} onClick={onClose}>Keep booking</button>
        </div>
      </>
    );
  }

  // ---------- WAITLIST ----------
  function Waitlist({ nav }) {
    const [items, setItems] = useState([
      { id: "w1", studio: "L'Accent Barber", studioId: "laccent", slot: "Today · 16:00", svc: "Skin fade & beard", photo: D.STUDIOS.find(s=>s.id==="laccent").photo, on: true },
      { id: "w2", studio: "Kreol Spa", studioId: "kreol-spa", slot: "Sat · morning", svc: "Coconut & frangipani massage", photo: D.STUDIOS.find(s=>s.id==="kreol-spa").photo, on: true },
    ]);
    return (
      <div className="sheet-full">
        <TopBar title="Waitlist" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <p className="muted" style={{ margin: "0 0 12px" }}>We'll notify you the moment a slot frees up. Booking still free — first to tap gets it.</p>
          {items.length === 0 ? (
            <div className="empty"><div className="empty-ic"><Ic name="clock" size={26} /></div><div className="h-md">No waitlists</div><p className="muted" style={{ margin: 0 }}>Tap "Join waitlist" on a full time slot.</p></div>
          ) : items.map((w) => (
            <div className="bk" key={w.id} style={{ cursor: "default", marginBottom: 12 }}>
              <img className="bk-photo" src={w.photo} alt="" />
              <div className="bk-info"><div className="bk-when">{w.slot}</div><div className="bk-name">{w.svc}</div><div className="bk-sub">{w.studio}</div></div>
              <span className={"switch" + (w.on ? " is-on" : "")} onClick={() => setItems(items.map(x => x.id===w.id?{...x,on:!x.on}:x))}><i /></span>
            </div>
          ))}
        </div></div>
      </div>
    );
  }

  // ---------- PACKAGES & GIFT CARDS ----------
  function Packages({ nav }) {
    const owned = [
      { id: "p1", name: "5× Coconut massage", studio: "Kreol Spa", left: 2, total: 5, exp: "Exp. Dec 2026" },
      { id: "p2", name: "Unlimited yoga · monthly", studio: "North Shore Fitness", left: "∞", total: "∞", exp: "Renews 1 Aug" },
    ];
    return (
      <div className="sheet-full">
        <TopBar title="Packages & gift cards" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <div className="wallet"><div className="tiny" style={{ opacity: 0.8 }}>Gift card balance</div><div className="wallet-amt">€40</div><div className="tiny" style={{ opacity: 0.8 }}>Use at any sey.la studio</div></div>
          <div className="sec-title" style={{ marginTop: 22 }}><h2 className="h-md">Your packages</h2></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {owned.map((p) => (
              <div className="loy" key={p.id}><div className="loy-head">
                <span className="staff-any"><Ic name="sparkle" size={20} /></span>
                <div style={{ flex: 1 }}><div className="scard-name">{p.name}</div><div className="loy-progress">{p.studio} · {p.exp}</div></div>
                <span className="tagpill loyal">{p.left} left</span>
              </div></div>
            ))}
          </div>
          <div className="block">
            <div className="sec-title"><h2 className="h-md">Buy</h2></div>
            <button className="paymethod" onClick={() => nav.push("giftbuy")}><span className="arow-ic"><Ic name="heart" size={19} /></span><div style={{ flex: 1 }}><div className="srv-name">Send a gift card</div><div className="srv-meta">€25 · €50 · €100</div></div><Ic name="chevronRight" size={18} color="var(--cocoa-40)" /></button>
            <button className="paymethod" onClick={() => nav.push("studio", { id: "kreol-spa" })}><span className="arow-ic"><Ic name="sparkle" size={19} /></span><div style={{ flex: 1 }}><div className="srv-name">Buy a service package</div><div className="srv-meta">Save up to 20% vs single visits</div></div><Ic name="chevronRight" size={18} color="var(--cocoa-40)" /></button>
          </div>
        </div></div>
      </div>
    );
  }

  function GiftBuy({ nav }) {
    const [amt, setAmt] = useState(50);
    const [done, setDone] = useState(false);
    if (done) return (
      <div className="sheet-full"><div className="app-scroll"><div className="confirm">
        <div className="confirm-ic"><Ic name="heart" size={34} color="var(--eucalyptus)" fill="var(--eucalyptus)" /></div>
        <h1 className="h-lg">Gift on its way</h1><p className="muted" style={{ margin: 0 }}>A €{amt} sey.la gift card has been sent.</p>
      </div></div><div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}><button className="btn btn--primary btn--full" onClick={nav.pop}>Done</button></div></div>
    );
    return (
      <div className="sheet-full">
        <TopBar title="Send a gift card" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 8 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Amount</div>
          <div className="slotgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>{[25,50,100].map(v => <button key={v} className={"slot" + (amt===v?" is-active":"")} onClick={() => setAmt(v)}>€{v}</button>)}</div>
          <div className="field" style={{ marginTop: 16 }}><span className="field-prefix">To</span><input placeholder="Recipient's phone or email" /></div>
          <div className="field" style={{ marginTop: 10 }}><input placeholder="Message (optional)" /></div>
        </div></div>
        <div style={{ padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))" }}><button className="btn btn--primary btn--full" onClick={() => setDone(true)}>Pay €{amt} & send</button></div>
      </div>
    );
  }

  // ---------- MESSAGES ----------
  function Messages({ nav }) {
    const threads = [
      { id: "kreol-spa", studio: "Kreol Spa", photo: D.STUDIOS.find(s=>s.id==="kreol-spa").photo, last: "See you tomorrow at 14:30 🌺", when: "2h", unread: true },
      { id: "laccent", studio: "L'Accent Barber", photo: D.STUDIOS.find(s=>s.id==="laccent").photo, last: "A slot opened at 16:00 today", when: "1d", unread: false },
    ];
    return (
      <div className="sheet-full">
        <TopBar title="Messages" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 4 }}>
          {threads.map((t) => (
            <div className="arow" key={t.id} onClick={() => nav.push("thread", { id: t.id })}>
              <img className="avatar" style={{ width: 46, height: 46 }} src={t.photo} alt="" />
              <div style={{ flex: 1, minWidth: 0 }}><div className="appt-name">{t.studio}</div><div className="srv-meta" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.last}</div></div>
              <div style={{ textAlign: "right" }}><div className="tiny muted">{t.when}</div>{t.unread && <span className="dotsep" style={{ width: 8, height: 8, background: "var(--clay)", marginTop: 4 }} />}</div>
            </div>
          ))}
        </div></div>
      </div>
    );
  }

  function Thread({ id, nav }) {
    const st = D.STUDIOS.find(s => s.id === id);
    const [msgs, setMsgs] = useState([
      { me: false, t: "Hi Amelia! Confirming your massage tomorrow at 14:30 with Aline 🌺" },
      { me: true, t: "Perfect, thank you! Any parking nearby?" },
      { me: false, t: "Yes — free spots right by the beach entrance." },
    ]);
    const [txt, setTxt] = useState("");
    function send() { if (!txt.trim()) return; setMsgs([...msgs, { me: true, t: txt }]); setTxt(""); }
    return (
      <div className="sheet-full">
        <TopBar title={st.name} onBack={nav.pop} />
        <div className="app-scroll" style={{ paddingBottom: 76 }}><div className="screen" style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.map((m, i) => <div key={i} className={"msgbubble" + (m.me ? " me" : "")}>{m.t}</div>)}
        </div></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 14px calc(10px + env(safe-area-inset-bottom,0px))", background: "var(--surface)", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
          <input className="field" style={{ flex: 1, height: 46 }} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Message…" onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
          <button className="iconbtn" style={{ width: 46, height: 46, background: "var(--ink)", color: "var(--cream)", border: "none" }} onClick={send}><Ic name="arrowRight" size={20} color="var(--cream)" /></button>
        </div>
      </div>
    );
  }

  // ---------- NOTIFICATION SETTINGS ----------
  function NotifSettings({ nav }) {
    const EVENTS = [
      { id: "confirm", lb: "Booking confirmation" },
      { id: "r24", lb: "Reminder · 24h before" },
      { id: "r2", lb: "Reminder · 2h before" },
      { id: "change", lb: "Changes & cancellations" },
      { id: "wait", lb: "Waitlist — a slot opened" },
      { id: "promo", lb: "Offers & promotions" },
    ];
    const CH = ["push", "sms", "email"];
    const [prefs, setPrefs] = useState(() => {
      const base = {}; EVENTS.forEach((e) => base[e.id] = { push: true, sms: e.id !== "promo", email: e.id === "confirm" || e.id === "change" });
      return base;
    });
    const toggle = (e, c) => setPrefs((p) => ({ ...p, [e]: { ...p[e], [c]: !p[e][c] } }));
    return (
      <div className="sheet-full">
        <TopBar title="Notification settings" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <p className="muted" style={{ margin: "0 0 10px" }}>Choose how each update reaches you. Reminders help you never miss a visit.</p>
          <div className="notifmatrix-head"><span /><span>Push</span><span>SMS</span><span>Email</span></div>
          {EVENTS.map((e) => (
            <div className="notifrow" key={e.id}>
              <span className="notifrow-lb">{e.lb}</span>
              {CH.map((c) => (
                <span key={c} className={"minicheck" + (prefs[e.id][c] ? " is-on" : "")} role="checkbox" aria-checked={prefs[e.id][c]} aria-label={e.lb + " " + c} onClick={() => toggle(e.id, c)}>
                  {prefs[e.id][c] && <Ic name="check" size={14} color="var(--cream)" />}
                </span>
              ))}
            </div>
          ))}
          <div className="paynote" style={{ marginTop: 16 }}><Ic name="shield" size={16} color="var(--eucalyptus)" /> We'll always send a confirmation and any cancellation, even if muted, so you're never caught out.</div>
        </div></div>
      </div>
    );
  }

  // ---------- LANGUAGE ----------
  function Language({ nav }) {
    const [lang, setLang] = useState(() => load("lang", "en"));
    const opts = [["en", "English", "English"], ["fr", "Français", "French"], ["crs", "Kreol Seselwa", "Seychellois Creole"]];
    return (
      <div className="sheet-full">
        <TopBar title="Language" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <p className="muted" style={{ margin: "0 0 12px" }}>Choose your language. Studio names and services stay as the studio wrote them.</p>
          {opts.map((o) => (
            <button key={o[0]} className={"paymethod" + (lang === o[0] ? " is-on" : "")} onClick={() => { setLang(o[0]); save("lang", o[0]); }}>
              <span className="arow-ic"><Ic name="globe" size={19} /></span>
              <div style={{ flex: 1 }}><div className="srv-name">{o[1]}</div><div className="srv-meta">{o[2]}</div></div>
              {lang === o[0] && <Ic name="check" size={18} color="var(--ink)" />}
            </button>
          ))}
        </div></div>
      </div>
    );
  }

  // ---------- PAYMENT METHODS ----------
  function PaymentMethods({ nav }) {
    const [cards, setCards] = useState([{ id: 1, brand: "Visa", last: "4291", exp: "08/27", def: true }]);
    return (
      <div className="sheet-full">
        <TopBar title="Payment methods" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <p className="muted" style={{ margin: "0 0 12px" }}>Used for deposits and no-show protection. Booking itself is always free.</p>
          {cards.map((c) => (
            <div className="paymethod is-on" key={c.id} style={{ cursor: "default" }}>
              <span className="arow-ic"><Ic name="card" size={19} /></span>
              <div style={{ flex: 1 }}><div className="srv-name">{c.brand} ···· {c.last}</div><div className="srv-meta">Expires {c.exp}{c.def ? " · Default" : ""}</div></div>
            </div>
          ))}
          <button className="paymethod" onClick={() => setCards([...cards, { id: Date.now(), brand: "Mastercard", last: "8830", exp: "05/28" }])}>
            <span className="arow-ic"><Ic name="sparkle" size={19} /></span>
            <div style={{ flex: 1 }}><div className="srv-name">Add a card</div><div className="srv-meta">Visa · Mastercard · Amex</div></div>
            <Ic name="chevronRight" size={18} color="var(--cocoa-40)" />
          </button>
          <div className="block--flush">
            <div className="eyebrow" style={{ marginBottom: 8 }}>Balances</div>
            <div className="receipt">
              <div className="receipt-row"><span className="k">Gift card</span><span className="v">€40</span></div>
              <div className="receipt-row"><span className="k">Invite wallet</span><span className="v">€15</span></div>
            </div>
          </div>
          <div className="paynote" style={{ marginTop: 14 }}><Ic name="shield" size={16} color="var(--eucalyptus)" /> A no-show or a late cancel (under 12h) may charge the studio's fee. You'll always see it before you book.</div>
        </div></div>
      </div>
    );
  }

  // ---------- TAB BAR ----------
  function TabBar({ tab, setTab, upcoming }) {
    const tabs = [
      { id: "home", ic: "home", lb: "Home" },
      { id: "search", ic: "search", lb: "Search" },
      { id: "bookings", ic: "calendar", lb: "Bookings" },
      { id: "account", ic: "user", lb: "Account" },
    ];
    return (
      <nav className="tabbar">
        {tabs.map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " is-active" : "")} onClick={() => setTab(t.id)}>
            <span style={{ position: "relative" }}>
              <Ic name={t.ic} size={24} sw={tab === t.id ? 2.1 : 1.75} />
              {t.id === "bookings" && upcoming > 0 && <span style={{ position: "absolute", top: -3, right: -8, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: "var(--clay)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{upcoming}</span>}
            </span>
            <span className="tab-lb">{t.lb}</span>
          </button>
        ))}
      </nav>
    );
  }

  // ---------- ROOT ----------
  function App() {
    const [tab, setTab] = useState("home");
    const [stack, setStack] = useState([]); // overlay pages on top of the active tab
    const [favs, setFavs] = useState(() => load("favs", []));
    const [bookings, setBookings] = useState(() => load("bookings", D.BOOKINGS));
    const [joined, setJoined] = useState(() => load("joined", []));
    const [reviewed, setReviewed] = useState(() => load("reviewed", []));
    const [manage, setManage] = useState(null); // booking being managed (action sheet)
    const [showSplash, setShowSplash] = useState(true);
    const [user, setUser] = useState(() => load("user", null));
    const [notif, setNotif] = useState(() => load("notif", true));
    const [toast, setToast] = useState(null);
    const [install, setInstall] = useState(false);

    useEffect(() => save("favs", favs), [favs]);
    useEffect(() => save("bookings", bookings), [bookings]);
    useEffect(() => save("joined", joined), [joined]);
    useEffect(() => save("reviewed", reviewed), [reviewed]);
    useEffect(() => save("user", user), [user]);
    useEffect(() => save("notif", notif), [notif]);
    useEffect(() => { const t = setTimeout(() => setInstall(true), 2600); return () => clearTimeout(t); }, []);

    // Reconcile with a real Supabase session (shared from the site login / magic-link
    // return). Reflect a signed-in user; only clear on an explicit sign-out so a
    // persisted/demo user is never wiped on load.
    useEffect(() => {
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) return;
      const asUser = (u) => ({ name: u.email ? u.email.split("@")[0] : "Guest", phone: u.email || "", email: u.email || "", real: true });
      window.SEY_BOOK.getUser().then((u) => { if (u) setUser(asUser(u)); });
      const unsub = window.SEY_BOOK.onAuthChange((u, event) => {
        if (u) setUser(asUser(u));
        else if (event === "SIGNED_OUT") setUser(null);
      });
      return unsub;
    }, []);

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 1800); };
    const nav = {
      push: (name, props) => setStack((s) => [...s, { name, props: props || {} }]),
      pop: () => setStack((s) => s.slice(0, -1)),
      reset: (toTab) => { setStack([]); if (toTab) setTab(toTab); },
    };
    const toggleFav = (id) => setFavs((f) => { const on = f.includes(id); showToast(on ? "Removed from favourites" : "Saved to favourites"); return on ? f.filter((x) => x !== id) : [...f, id]; });
    const addBooking = (b) => setBookings((v) => [b, ...v]);
    const cancelBooking = (id) => { setBookings((v) => v.filter((b) => b.id !== id)); setManage(null); showToast("Booking cancelled"); };
    const joinClass = (c) => { setJoined((j) => [...j, c.id]); addBooking({ id: "bk" + Date.now(), studioId: c.studioId, studio: c.studio, area: "", service: c.name + " · class", when: c.day + " · " + c.time, price: c.price, status: "Confirmed", photo: D.STUDIOS.find((s) => s.id === c.studioId).photo, past: false }); showToast("You joined the class"); };

    const switchTab = (t) => { setStack([]); setTab(t); };
    const upcoming = bookings.filter((b) => !b.past).length;

    // active tab screen
    let base;
    if (tab === "home") base = <Home nav={nav} favs={favs} toggleFav={toggleFav} setTab={switchTab} notif={notif} />;
    else if (tab === "search") base = <Search nav={nav} favs={favs} toggleFav={toggleFav} />;
    else if (tab === "bookings") base = <Bookings bookings={bookings} nav={nav} onManage={setManage} reviewed={reviewed} />;
    else base = <Account user={user} setUser={setUser} favs={favs} nav={nav} notif={notif} setNotif={setNotif} />;

    // top overlay
    const top = stack[stack.length - 1];
    let overlay = null;
    if (top) {
      const p = top.props;
      if (top.name === "studio") overlay = <Studio id={p.id} nav={nav} favs={favs} toggleFav={toggleFav} />;
      else if (top.name === "search") overlay = <div className="sheet-full"><TopBar title="Browse" onBack={nav.pop} /><div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}><Search nav={nav} favs={favs} toggleFav={toggleFav} initialCat={p.cat} /></div></div>;
      else if (top.name === "book") overlay = <BookFlow id={p.id} serviceId={p.serviceId} nav={nav} addBooking={addBooking} />;
      else if (top.name === "classJoin") overlay = <ClassJoin id={p.id} nav={nav} joinClass={joinClass} joinedIds={joined} />;
      else if (top.name === "classes") overlay = <Classes nav={nav} />;
      else if (top.name === "favs") overlay = <Favourites favs={favs} toggleFav={toggleFav} nav={nav} />;
      else if (top.name === "notif") overlay = <Notifications nav={nav} />;
      else if (top.name === "rewards") overlay = <Rewards nav={nav} />;
      else if (top.name === "invite") overlay = <Invite nav={nav} />;
      else if (top.name === "review") { const bk = bookings.find((b) => b.id === p.bookingId); overlay = <ReviewFlow booking={bk} nav={nav} onSubmit={(id) => setReviewed((r) => [...r, id])} />; }
      else if (top.name === "waitlist") overlay = <Waitlist nav={nav} />;
      else if (top.name === "packages") overlay = <Packages nav={nav} />;
      else if (top.name === "giftbuy") overlay = <GiftBuy nav={nav} />;
      else if (top.name === "messages") overlay = <Messages nav={nav} />;
      else if (top.name === "thread") overlay = <Thread id={p.id} nav={nav} />;
      else if (top.name === "notifsettings") overlay = <NotifSettings nav={nav} />;
      else if (top.name === "payments") overlay = <PaymentMethods nav={nav} />;
      else if (top.name === "language") overlay = <Language nav={nav} />;
    }

    return (
      <div className="app">
        {showSplash && (
          <div className="splash" onAnimationEnd={() => setShowSplash(false)}>
            <div className="brand" style={{ fontSize: "1.7rem" }}><b>sey.la</b><span>|</span><i>book</i></div>
            <div className="tiny" style={{ opacity: 0.7 }}>Book your island ritual</div>
          </div>
        )}
        {base}
        {overlay}
        {!top && <TabBar tab={tab} setTab={switchTab} upcoming={upcoming} />}
        {toast && <div className="toast">{toast}</div>}
        {manage && (
          <BookingActions booking={manage}
            onClose={() => setManage(null)}
            onCancel={() => cancelBooking(manage.id)}
            onViewStudio={() => { const m = manage; setManage(null); nav.push("studio", { id: m.studioId }); }}
            onReschedule={() => { const m = manage; setManage(null); nav.push("book", { id: m.studioId }); showToast("Pick a new time"); }}
          />
        )}
        {install && !top && (
          <div className="install">
            <span className="arow-ic" style={{ background: "rgba(255,255,255,0.14)", color: "var(--cream)" }}><Ic name="home" size={20} color="var(--cream)" /></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>Install sey.la | book</div><div className="tiny" style={{ opacity: 0.8 }}>Add to home screen · works offline</div></div>
            <button className="btn btn--sm" onClick={() => { setInstall(false); showToast("Look for 'Add to Home Screen'"); }}>Add</button>
            <button className="iconbtn iconbtn--plain" style={{ width: 32, height: 32, color: "var(--cream)" }} onClick={() => setInstall(false)} aria-label="Dismiss"><Ic name="close" size={18} color="var(--cream)" /></button>
          </div>
        )}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
