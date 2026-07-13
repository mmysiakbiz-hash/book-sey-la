// sey.la | book — mobile PWA. Full client app: discover, search+map, studio profile,
// booking flow, classes, bookings, favourites, account/OTP, notifications.
(function () {
  const { Ic, Stars } = window.SEY_UI;
  const D = window.SEY_DATA;
  const { useState, useEffect, useRef } = React;

  // ---------- persistence ----------
  const load = (k, f) => { try { return JSON.parse(localStorage.getItem("sey." + k)) ?? f; } catch { return f; } };
  const save = (k, v) => { try { localStorage.setItem("sey." + k, JSON.stringify(v)); } catch {} };

  // ---------- real map (Leaflet + OpenStreetMap, loaded on demand) ----------
  const SEY_CENTER = [-4.62, 55.45]; // Mahé
  let _leafletPromise = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (_leafletPromise) return _leafletPromise;
    _leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector("link[data-leaflet]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet"; link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "1"); document.head.appendChild(link);
      }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.setAttribute("data-leaflet", "1");
      s.onload = () => resolve(window.L); s.onerror = reject;
      document.body.appendChild(s);
    });
    return _leafletPromise;
  }

  // A real OSM map with a pin per studio that has coordinates. onSelect(id) fires
  // when a pin is tapped. Falls back to a friendly note if Leaflet can't load.
  function MapView({ studios, activeId, onSelect }) {
    const elRef = useRef(null);
    const mapRef = useRef(null);
    const [failed, setFailed] = useState(false);
    const pins = (studios || []).filter((s) => typeof s.lat === "number" && typeof s.lng === "number");

    useEffect(() => {
      let cancelled = false;
      loadLeaflet().then((L) => {
        if (cancelled || !elRef.current) return;
        if (!mapRef.current) {
          mapRef.current = L.map(elRef.current, { scrollWheelZoom: false, attributionControl: false }).setView(SEY_CENTER, 11);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapRef.current);
        }
        const map = mapRef.current;
        (map._seyMarkers || []).forEach((m) => map.removeLayer(m));
        map._seyMarkers = [];
        const coords = [];
        pins.forEach((s) => {
          const icon = L.divIcon({ className: "sey-pin" + (s.id === activeId ? " is-active" : ""), html: "<span></span>", iconSize: [24, 24], iconAnchor: [12, 22] });
          const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
          m.on("click", () => onSelect && onSelect(s.id));
          map._seyMarkers.push(m);
          coords.push([s.lat, s.lng]);
        });
        if (coords.length === 1) map.setView(coords[0], 14);
        else if (coords.length > 1) map.fitBounds(coords, { padding: [40, 40], maxZoom: 14 });
        setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 60);
      }).catch(() => { if (!cancelled) setFailed(true); });
      return () => { cancelled = true; };
    }, [studios, activeId]);

    useEffect(() => () => { if (mapRef.current) { try { mapRef.current.remove(); } catch (e) {} mapRef.current = null; } }, []);

    if (failed) return <div className="map" style={{ display: "grid", placeItems: "center" }}><span className="muted tiny" style={{ padding: 20, textAlign: "center" }}>Map couldn’t load. Check your connection and try again.</span></div>;
    return <div ref={elRef} className="map-live" style={{ position: "absolute", inset: 0 }} />;
  }

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
          {s.photo
            ? <img src={s.photo} alt={s.name} loading="lazy" />
            : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--blush)", color: "var(--clay)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem" }}>{(s.name || "?").trim().charAt(0).toUpperCase()}</span>}
          <span className="scard-tag">{s.tag}</span>
          <span className={"scard-fav" + (fav ? " is-on" : "")} role="button" aria-label="Save"
            onClick={(ev) => { ev.stopPropagation(); onFav(s.id); }}>
            <Ic name="heart" size={18} fill={fav ? "var(--clay)" : "none"} color={fav ? "var(--clay)" : "var(--ink)"} />
          </span>
        </div>
        <div className="scard-body">
          <div className="scard-row">
            <span className="scard-name">{s.name}</span>
            {typeof s.rating === "number" && <Stars r={s.rating} />}
          </div>
          <div className="scard-meta">
            <Ic name="pin" size={13} color="var(--cocoa-40)" />{s.area}
            {s.distance ? <React.Fragment><i className="dotsep" />{s.distance}</React.Fragment> : null}
          </div>
        </div>
      </button>
    );
  }

  // "Book again" card for the home hub (visited / favourite studios).
  function RebookCard({ s, last, onOpen, onBookAgain }) {
    return (
      <div className="scard rebook">
        <button className="scard-photo" onClick={onOpen} style={{ border: "none", padding: 0, cursor: "pointer", display: "block", width: "100%" }}>
          {s.photo
            ? <img src={s.photo} alt={s.name} loading="lazy" />
            : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--blush)", color: "var(--clay)", fontWeight: 700, fontSize: "2rem" }}>{(s.name || "?").trim().charAt(0).toUpperCase()}</span>}
          {typeof s.rating === "number" && <span className="scard-tag" style={{ left: "auto", right: 10 }}>★ {s.rating}</span>}
        </button>
        <div className="scard-body">
          <div className="scard-row"><span className="scard-name">{s.name}</span></div>
          <div className="srv-meta" style={{ marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {last && last.serviceName ? last.serviceName + (last.staffName ? " · " + last.staffName : "") : s.area}
          </div>
          <button className="btn btn--primary btn--full" style={{ marginTop: 12, padding: "11px" }} onClick={onBookAgain}>Book again</button>
        </div>
      </div>
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
  function Home({ nav, favs, toggleFav, setTab, hasNotifs, visits }) {
    const near = D.STUDIOS;
    const rec = D.STUDIOS.slice().sort((a, b) => b.rating - a.rating);
    const hasStudios = D.STUDIOS.length > 0;

    // "Visited & favourites" hub (à la Booksy's Moje Booksy): studios you've booked
    // before (most recent, with the last service for one-tap re-booking), then any
    // favourites you haven't visited yet.
    const hub = React.useMemo(() => {
      const out = [];
      const seen = new Set();
      (visits || []).forEach((v) => {
        if (seen.has(v.studioSlug)) return;
        const s = D.STUDIOS.find((x) => x.id === v.studioSlug);
        if (!s) return;
        seen.add(v.studioSlug);
        out.push({ s, last: v });
      });
      (favs || []).forEach((id) => {
        if (seen.has(id)) return;
        const s = D.STUDIOS.find((x) => x.id === id);
        if (!s) return;
        seen.add(id);
        out.push({ s, last: null });
      });
      return out;
    }, [visits, favs]);

    function bookAgain(entry) {
      const s = entry.s;
      let svcId = null;
      const name = entry.last && entry.last.serviceName;
      if (name) {
        const items = (s.services || []).flatMap((g) => g.items);
        const it = items.find((i) => i.name === name);
        if (it) svcId = it.id;
      }
      nav.push("book", svcId ? { id: s.id, serviceId: svcId } : { id: s.id });
    }
    return (
      <>
        <TopBar brand right={
          <button className="iconbtn iconbtn--plain bell" aria-label="Notifications" onClick={() => nav.push("notif")}>
            <Ic name="bell" />{hasNotifs && <span className="dot" />}
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

            {hub.length > 0 && (
              <div className="block">
                <div className="sec-title"><h2 className="h-md">Visited &amp; favourites</h2></div>
                <div className="hscroll">
                  {hub.map((e) => <RebookCard key={e.s.id} s={e.s} last={e.last} onOpen={() => nav.push("studio", { id: e.s.id })} onBookAgain={() => bookAgain(e)} />)}
                </div>
              </div>
            )}

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
                <div className="empty-ic"><Ic name="search" size={26} /></div>
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

    // Draggable map sheet (Airbnb-style). Heights are in PIXELS off the measured
    // pane height (percentages don't resolve reliably here), and the drag is
    // tracked on window so the finger can leave the small handle.
    const paneRef = useRef(null);
    const dragRef = useRef(null);
    const [paneH, setPaneH] = useState(0);
    const [frac, setFrac] = useState(0.55); // sheet height as a fraction of the pane (rests high enough to grab)
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
      if (mode !== "map") return;
      const measure = () => { if (paneRef.current) setPaneH(paneRef.current.clientHeight); };
      measure();
      const t = setTimeout(measure, 80);
      window.addEventListener("resize", measure);
      return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
    }, [mode]);

    useEffect(() => {
      if (!dragging) return;
      const move = (e) => {
        if (!dragRef.current) return;
        if (e.cancelable) e.preventDefault();
        const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
        const dy = dragRef.current.y - y;
        const nf = Math.min(0.92, Math.max(0.34, dragRef.current.frac + dy / (dragRef.current.h || 1)));
        setFrac(nf);
      };
      const up = () => { dragRef.current = null; setDragging(false); setFrac((f) => (f < 0.45 ? 0.34 : f < 0.72 ? 0.58 : 0.92)); };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", up);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", up);
      };
    }, [dragging]);

    const startDrag = (clientY) => {
      const h = paneRef.current ? paneRef.current.clientHeight : (paneH || window.innerHeight);
      dragRef.current = { y: clientY, frac, h };
      setDragging(true);
    };
    const sheetH = paneH ? Math.round(frac * paneH) : Math.round(0.55 * (window.innerHeight - 220));

    return (
      <>
        <TopBar title="Browse" />
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
          // Airbnb-style: full map behind, a draggable list sheet over it.
          <div ref={paneRef} style={{ flex: 1, position: "relative", minHeight: 0 }}>
            {/* zIndex:0 traps Leaflet's high internal z-indexes so the sheet/toggle sit above the map */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <MapView studios={list} activeId={active} onSelect={setActive} />
            </div>
            {list.every((s) => typeof s.lat !== "number" || typeof s.lng !== "number") && (
              <div style={{ position: "absolute", left: 14, right: 14, top: 14 }}>
                <div className="muted tiny" style={{ background: "rgba(252,248,242,0.94)", padding: "8px 12px", borderRadius: 999, textAlign: "center" }}>Studios appear on the map once they’ve set their location.</div>
              </div>
            )}
            <div className="map-sheet" style={{ height: sheetH + "px", transition: dragging ? "none" : "height .22s ease" }}>
              <div className="map-sheet-drag"
                onPointerDown={(e) => startDrag(e.clientY)}
                onTouchStart={(e) => { if (e.touches[0]) startDrag(e.touches[0].clientY); }}>
                <div className="map-list-grab" />
                <div className="muted tiny" style={{ textAlign: "center", marginTop: -2 }}>{list.length} studio{list.length === 1 ? "" : "s"} · drag to expand</div>
              </div>
              <div className="map-sheet-scroll">
                <div className="slist">
                  {list.map((s) => <StudioCard key={s.id} s={s} onOpen={() => nav.push("studio", { id: s.id })} fav={favs.includes(s.id)} onFav={toggleFav} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating toggle between the full list and the map */}
        <button className="map-toggle" onClick={() => { setActive(null); setMode(mode === "list" ? "map" : "list"); }}>
          {mode === "list"
            ? <><Ic name="pin" size={17} color="var(--cream)" /> Map</>
            : <><Ic name="filter" size={17} color="var(--cream)" /> List</>}
        </button>
      </>
    );
  }

  // ---------- STUDIO PROFILE ----------
  function Studio({ id, nav, favs, toggleFav, showToast }) {
    async function share(name) {
      const url = `https://book.sey.la/studio/${id}`;
      try {
        if (navigator.share) { await navigator.share({ title: name, text: `Book ${name} on sey.la | book`, url }); return; }
        await navigator.clipboard.writeText(url);
        showToast && showToast("Link copied");
      } catch (e) { /* user cancelled share — ignore */ }
    }
    const s = D.STUDIOS.find((x) => x.id === id);
    const classes = D.CLASSES.filter((c) => c.studioId === id);
    const [tab, setTab] = useState("services");
    return (
      <div className="sheet-full">
        <div style={{ position: "relative" }}>
          <img src={s.photo.replace("w=600", "w=800")} alt={s.name} style={{ width: "100%", height: 230, objectFit: "cover", filter: "var(--photo-filter)" }} />
          <button className="iconbtn topbar-back" style={{ position: "absolute", top: 14, left: 14 }} onClick={nav.pop} aria-label="Back"><Ic name="back" /></button>
          <button className="iconbtn" style={{ position: "absolute", top: 14, right: 14 }} aria-label="Share" onClick={() => share(s.name)}><Ic name="share" size={19} /></button>
          <button className="iconbtn" style={{ position: "absolute", top: 14, right: 66 }} onClick={() => toggleFav(s.id)} aria-label="Save">
            <Ic name="heart" size={19} fill={favs.includes(s.id) ? "var(--clay)" : "none"} color={favs.includes(s.id) ? "var(--clay)" : "var(--ink)"} />
          </button>
        </div>
        <div className="app-scroll" style={{ paddingBottom: 100 }}>
          <div className="screen" style={{ paddingTop: 16 }}>
            <span className="scard-tag" style={{ position: "static", display: "inline-block", marginBottom: 8 }}>{s.tag}</span>
            <h1 className="h-lg">{s.name}</h1>
            <div className="scard-meta" style={{ marginTop: 8, fontSize: "0.9rem" }}>
              {typeof s.rating === "number" && <React.Fragment><Stars r={s.rating} /> <b style={{ color: "var(--ink)" }}>{s.rating}</b>{s.reviews ? ` (${s.reviews})` : ""}<i className="dotsep" /></React.Fragment>}
              <Ic name="pin" size={13} color="var(--cocoa-40)" />{s.area}
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
                      <span className="srv-price">{it.poa ? "On request" : "SCR " + it.price}</span>
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
    // Only offer staff who perform every chosen service (empty list = does all).
    const chosenNames = chosen.map((c) => c.name);
    const eligibleStaff = staffPool.filter((p) => !(p.services && p.services.length) || chosenNames.every((n) => p.services.includes(n)));
    const staffName = staff === "any" ? "Any professional" : (staffPool.find((p) => p.id === staff) || {}).name;
    const TITLES = ["Choose services", "Choose professional", "Pick a time", "Review"];

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
                <div className="receipt-row"><span className="k">Payment</span><span className="v">On site · cash or card</span></div>
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
                      <div><div className="srv-name">{it.name}</div><div className="srv-meta">{it.dur} · {it.poa ? "On request" : "SCR " + it.price}</div></div>
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
                {eligibleStaff.map((p) => (
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
                <div className="paynote"><Ic name="shield" size={16} color="var(--eucalyptus)" /> Pay the studio directly on the day — cash or card. No online payment, no card needed.</div>
                <div className="receipt" style={{ marginTop: 4 }}>
                  <div className="receipt-row"><span className="k">{chosen.length} service{chosen.length > 1 ? "s" : ""}</span><span className="v">SCR {total}</span></div>
                  <div className="receipt-row"><span className="k">With</span><span className="v">{staffName}</span></div>
                  <div className="receipt-row"><span className="k">When</span><span className="v">{D.DAYS[day].d} · {slot}</span></div>
                  <div className="receipt-row"><span className="k">Pay</span><span className="v">On site · cash or card</span></div>
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))", background: "color-mix(in srgb, var(--surface) 94%, transparent)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--line)" }}>
          {step === 0 && <button className="btn btn--primary btn--full" disabled={!picked.length} onClick={() => setStep(1)}>Continue{total ? " · SCR " + total : ""}</button>}
          {step === 1 && <button className="btn btn--primary btn--full" onClick={() => setStep(2)}>Continue</button>}
          {step === 2 && <button className="btn btn--primary btn--full" disabled={!slot} onClick={() => setStep(3)}>Continue {slot ? "· " + D.DAYS[day].d + " " + slot : ""}</button>}
          {step === 3 && <button className="btn btn--primary btn--full" onClick={confirm}>Confirm booking</button>}
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
  function Notifications({ nav, bookings }) {
    // Real notifications only: a reminder for each of your upcoming bookings.
    // No bookings → nothing to show (a logged-out visitor sees an empty state).
    const items = (bookings || [])
      .filter((b) => !b.past)
      .map((b) => ({ ic: "calendar", t: "Reminder: " + b.service, s: [b.when, b.studio].filter(Boolean).join(" · ") }));
    return (
      <div className="sheet-full">
        <TopBar title="Notifications" onBack={nav.pop} right={<button className="iconbtn iconbtn--plain" aria-label="Settings" onClick={() => nav.push("notifsettings")}><Ic name="shield" size={20} /></button>} />
        <div className="app-scroll">
          <div className="screen">
            {items.length === 0 ? (
              <div className="empty">
                <div className="empty-ic"><Ic name="bell" size={26} /></div>
                <div className="h-md" style={{ marginBottom: 4 }}>No notifications yet</div>
                <p className="muted" style={{ margin: 0 }}>Booking reminders and updates will show up here.</p>
              </div>
            ) : items.map((n, i) => (
              <div className="arow" key={i}>
                <span className="arow-ic"><Ic name={n.ic} size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{n.t}</div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>{n.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- ACCOUNT + LOGIN/OTP ----------
  function Account({ user, setUser, favs, nav, notif, setNotif, isOwner, onSwitchToPro, visitCount }) {
    if (!user) return <Login onDone={setUser} />;
    const rows = [
      { ic: "sparkle", lb: "Rewards & stamps", go: () => nav.push("rewards") },
      { ic: "heart", lb: "Favourites", go: () => nav.push("favs") },
      { ic: "sparkle", lb: "Invite a studio · €15", go: () => nav.push("invite") },
      { ic: "bell", lb: "Notifications", go: () => nav.push("notif") },
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
            {isOwner && (
              <button className="arow" onClick={onSwitchToPro} style={{ width: "100%", background: "var(--ink)", color: "var(--cream)", borderRadius: "var(--radius-lg)", marginBottom: 14 }}>
                <span className="arow-ic" style={{ background: "rgba(255,255,255,0.14)", color: "var(--cream)" }}><Ic name="calendar" size={20} color="var(--cream)" /></span>
                <span className="arow-lb" style={{ color: "var(--cream)" }}>Studio dashboard<span style={{ display: "block", fontSize: "0.78rem", opacity: 0.75 }}>Manage your bookings &amp; clients</span></span>
                <Ic name="chevronRight" size={18} color="var(--cream)" />
              </button>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "14px", textAlign: "center" }}>
                <div className="h-md">{favs.length}</div><div className="tiny muted">Saved</div>
              </div>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "14px", textAlign: "center" }}>
                <div className="h-md">{visitCount || 0}</div><div className="tiny muted">Visits</div>
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
              <div className="arow">
                <span className="arow-ic"><Ic name="bell" size={20} /></span>
                <span className="arow-lb">Email reminders<span style={{ display: "block", fontSize: "0.78rem", color: "var(--cocoa-60)" }}>Confirmations &amp; reminders go to {user.email || "your email"}</span></span>
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
      <div className="login-hero">
        <div className="login-bg" />
        <div className="login-scrim" />
        <div className="login-top">
          <div className="brand login-brand"><b>sey.la</b><span>|</span><i>book</i></div>
          <div className="login-tag">Beauty &amp; wellness,<br />booked across the islands.</div>
        </div>
        <div className="login-card">
          {estate === "sent" ? (
            <>
              <h1 className="h-lg">Check your email</h1>
              <p className="muted" style={{ marginTop: 8 }}>We sent a magic link to <b>{email.trim()}</b>. Open it on this device to sign in — you'll come right back here.</p>
              <button className="btn btn--soft btn--full" style={{ marginTop: 22 }} onClick={() => setEstate("idle")}>Use a different email</button>
            </>
          ) : (
            <>
              <h1 className="h-lg">Log in or sign up</h1>
              <p className="muted" style={{ marginTop: 6 }}>Enter your email — we'll send a magic link. No password, and booking is always free.</p>
              <div className="field" style={{ marginTop: 18 }}>
                <input type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendLink(); }} />
              </div>
              <button className="btn btn--primary btn--full" style={{ marginTop: 14 }} disabled={estate === "sending" || !email.trim()} onClick={sendLink}>{estate === "sending" ? "Sending…" : "Send magic link"}</button>
              {estate === "error" && <p className="tiny" style={{ color: "var(--clay)", marginTop: 12 }}>Couldn't send the link ({emsg}). Please try again.</p>}
              <p className="tiny muted" style={{ marginTop: 14, lineHeight: 1.5 }}>By continuing you agree to the Terms and Privacy Policy.</p>
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
    const [confirming, setConfirming] = useState(false);
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
          {confirming ? (
            <>
              <p className="muted" style={{ margin: "4px 4px 14px" }}>Cancel this booking? This can’t be undone.</p>
              <button className="btn btn--full" style={{ background: "var(--clay)", color: "#fff" }} onClick={onCancel}>Yes, cancel booking</button>
              <button className="btn btn--soft btn--full" style={{ marginTop: 10 }} onClick={() => setConfirming(false)}>Keep booking</button>
            </>
          ) : (
            <>
              <button className="act" onClick={onReschedule}><span className="act-ic"><Ic name="calendar" size={20} /></span>Reschedule</button>
              <button className="act" onClick={onViewStudio}><span className="act-ic"><Ic name="pin" size={20} /></span>View studio</button>
              <button className="act danger" onClick={() => setConfirming(true)}><span className="act-ic" style={{ background: "var(--blush)" }}><Ic name="close" size={19} color="var(--clay)" /></span>Cancel booking</button>
              <button className="btn btn--soft btn--full" style={{ marginTop: 12 }} onClick={onClose}>Keep booking</button>
            </>
          )}
        </div>
      </>
    );
  }

  // ---------- NOTIFICATION SETTINGS ----------
  function NotifSettings({ nav }) {
    // Honest: today everything is sent by EMAIL (Brevo). In-app push and SMS
    // aren't wired yet, so we don't show toggles that wouldn't do anything.
    const EMAILS = [
      { id: "confirm", lb: "Booking confirmation", s: "Sent as soon as you book" },
      { id: "r24", lb: "Reminder before your visit", s: "A nudge ahead of your appointment" },
      { id: "change", lb: "Changes & cancellations", s: "If a booking moves or is cancelled" },
      { id: "wait", lb: "Waitlist — a spot opened", s: "When a full class frees up" },
    ];
    return (
      <div className="sheet-full">
        <TopBar title="Notifications" onBack={nav.pop} />
        <div className="app-scroll"><div className="screen" style={{ paddingTop: 6 }}>
          <p className="muted" style={{ margin: "0 0 14px" }}>Right now we keep you posted by <b>email</b>. These are the updates we send:</p>
          <div className="block--flush">
            {EMAILS.map((e) => (
              <div className="arow" key={e.id}>
                <span className="arow-ic"><Ic name="bell" size={20} /></span>
                <span className="arow-lb">{e.lb}<span style={{ display: "block", fontSize: "0.78rem", color: "var(--cocoa-60)" }}>{e.s}</span></span>
                <Ic name="check" size={18} color="var(--eucalyptus)" />
              </div>
            ))}
          </div>
          <div className="paynote" style={{ marginTop: 16 }}><Ic name="shield" size={16} color="var(--eucalyptus)" /> Push notifications and SMS aren’t available yet — they’re on the way. Email confirmations and reminders work today.</div>
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

  // ---------- OWNER (STUDIO PRO) MODE ----------
  // A simplified pro app for studio owners: a day-by-day agenda of bookings,
  // reschedule / cancel, and a message-your-clients composer. (Full setup —
  // services, hours, team, billing — stays on the web panel.)
  const MTZ = "Indian/Mahe";
  const mDayKey = (d) => d.toLocaleDateString("en-CA", { timeZone: MTZ });
  const mDayLabel = (d) => d.toLocaleDateString("en-GB", { timeZone: MTZ, weekday: "short", day: "numeric", month: "short" });
  const mTime = (d) => d.toLocaleTimeString("en-GB", { timeZone: MTZ, hour: "2-digit", minute: "2-digit" });

  function OwnerApp({ studio, onLogout, onSwitchToClient }) {
    const [agenda, setAgenda] = useState(null);
    const [sel, setSel] = useState(0);
    const [view, setView] = useState("agenda"); // agenda | message
    const [sheet, setSheet] = useState(null);    // booking action sheet
    const [toast, setToast] = useState(null);
    const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 1800); };

    const days = React.useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }), []);

    async function reload() {
      const rows = window.SEY_BOOK ? await window.SEY_BOOK.getStudioAgenda(studio.id) : [];
      setAgenda(rows);
    }
    useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

    const dayList = (agenda || []).filter((b) => mDayKey(b.start) === mDayKey(days[sel])).sort((a, b) => a.start - b.start);
    const countFor = (d) => (agenda || []).filter((b) => mDayKey(b.start) === mDayKey(d)).length;

    if (view === "message") return <OwnerMessage studio={studio} onBack={() => setView("agenda")} showToast={showToast} toast={toast} />;

    return (
      <div className="app">
        <div className="topbar">
          <div className="topbar-title" style={{ fontWeight: 700 }}>{studio.name || "Your studio"}</div>
          <div className="topbar-spacer" />
          <button className="btn btn--soft btn--sm" style={{ marginRight: 8 }} onClick={onSwitchToClient}>Client view</button>
          <button className="iconbtn iconbtn--plain" onClick={onLogout} aria-label="Log out"><Ic name="logout" /></button>
        </div>

        {studio.status !== "active" && (
          <div className="screen" style={{ paddingTop: 6, paddingBottom: 0 }}>
            <div className="tiny" style={{ background: "var(--blush)", color: "var(--clay)", padding: "10px 12px", borderRadius: 12 }}>
              Your page isn’t published yet. Finish setup on book.sey.la to go live.
            </div>
          </div>
        )}

        {/* Day strip */}
        <div className="ownerdays">
          {days.map((d, i) => (
            <button key={i} className={"ownerday" + (i === sel ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="ownerday-dow">{i === 0 ? "Today" : d.toLocaleDateString("en-GB", { timeZone: MTZ, weekday: "short" })}</span>
              <span className="ownerday-num">{d.toLocaleDateString("en-GB", { timeZone: MTZ, day: "numeric" })}</span>
              {countFor(d) > 0 && <span className="ownerday-dot" />}
            </button>
          ))}
        </div>

        <div className="app-scroll">
          <div className="screen" style={{ paddingTop: 10 }}>
            <div className="sec-title" style={{ marginBottom: 10 }}>
              <h2 className="h-md">{mDayLabel(days[sel])}</h2>
              <span className="muted tiny">{dayList.length} booking{dayList.length === 1 ? "" : "s"}</span>
            </div>

            {agenda === null ? (
              <p className="muted tiny">Loading…</p>
            ) : dayList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <span className="empty-ic"><Ic name="calendar" size={26} color="var(--cocoa-40)" /></span>
                <div className="h-md" style={{ marginTop: 12 }}>No bookings</div>
                <p className="muted" style={{ marginTop: 4 }}>Nothing booked for this day yet.</p>
              </div>
            ) : (
              <div className="slist">
                {dayList.map((b) => (
                  <button key={b.id} className="apptrow" onClick={() => setSheet(b)}>
                    <div className="apptrow-time">{mTime(b.start)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="appt-name">{b.client}</div>
                      <div className="srv-meta">{b.service}{b.staff ? " · " + b.staff : ""}{b.price != null ? " · SCR " + Math.round(b.price) : ""}</div>
                    </div>
                    <Ic name="chevronRight" size={18} color="var(--cocoa-40)" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ownerbar">
          <button className="btn btn--primary btn--full" onClick={() => setView("message")}><Ic name="bell" size={18} color="var(--cream)" /> Message clients</button>
        </div>

        {sheet && <OwnerBookingSheet booking={sheet} onClose={() => setSheet(null)}
          onReschedule={async (startISO, dur) => { const r = await window.SEY_BOOK.ownerReschedule(sheet.id, startISO, dur); if (r.error) { showToast("Couldn’t move: " + r.error); } else { showToast("Rescheduled"); setSheet(null); reload(); } }}
          onCancel={async () => { const r = await window.SEY_BOOK.ownerCancel(sheet.id); if (r.error) { showToast("Couldn’t cancel"); } else { showToast("Cancelled"); setSheet(null); reload(); } }} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  function OwnerBookingSheet({ booking, onClose, onReschedule, onCancel }) {
    const [mode, setMode] = useState("actions"); // actions | reschedule
    const dur = booking.end && booking.start ? Math.round((booking.end - booking.start) / 60000) : 60;
    const [date, setDate] = useState(mDayKey(booking.start));
    const [time, setTime] = useState(mTime(booking.start));
    const [busy, setBusy] = useState(false);

    async function doReschedule() {
      if (!date || !time) return;
      setBusy(true);
      const iso = new Date(date + "T" + time + ":00+04:00").toISOString();
      await onReschedule(iso, dur);
      setBusy(false);
    }

    return (
      <>
        <div className="sheet-scrim" onClick={onClose} />
        <div className="sheet">
          <div className="sheet-grab" />
          <div style={{ padding: "0 4px 6px" }}>
            <div className="h-md">{booking.client}</div>
            <div className="srv-meta">{booking.service}{booking.staff ? " · " + booking.staff : ""} · {mDayLabel(booking.start)} {mTime(booking.start)}</div>
          </div>
          {booking.phone && mode === "actions" && <a className="act" href={"tel:" + booking.phone} style={{ textDecoration: "none" }}><span className="act-ic"><Ic name="pin" size={20} /></span>Call {booking.phone}</a>}
          {booking.phone && mode === "actions" && (() => {
            const digits = String(booking.phone).replace(/[^0-9]/g, "");
            const text = `Hi ${booking.client || "there"}, about your ${booking.service || "appointment"} on ${mDayLabel(booking.start)} at ${mTime(booking.start)} — `;
            return <a className="act" href={`https://wa.me/${digits}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><span className="act-ic" style={{ background: "#25D36622" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 4.54 0 8.24 3.69 8.24 8.23 0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg></span>Message on WhatsApp</a>;
          })()}

          {mode === "actions" ? (
            <>
              <button className="act" onClick={() => setMode("reschedule")}><span className="act-ic"><Ic name="calendar" size={20} /></span>Reschedule</button>
              <button className="act danger" onClick={() => setMode("confirmCancel")}><span className="act-ic" style={{ background: "var(--blush)" }}><Ic name="close" size={19} color="var(--clay)" /></span>Cancel booking</button>
              <button className="btn btn--soft btn--full" style={{ marginTop: 12 }} onClick={onClose}>Close</button>
            </>
          ) : mode === "confirmCancel" ? (
            <>
              <p className="muted" style={{ margin: "4px 4px 14px" }}>Cancel {booking.client || "this client"}’s {booking.service || "booking"}? This frees the slot — let them know if needed.</p>
              <button className="btn btn--full" style={{ background: "var(--clay)", color: "#fff" }} onClick={onCancel} disabled={busy}>{busy ? "Cancelling…" : "Yes, cancel booking"}</button>
              <button className="btn btn--soft btn--full" style={{ marginTop: 10 }} onClick={() => setMode("actions")}>Keep booking</button>
            </>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="ofield" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input className="ofield" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <button className="btn btn--primary btn--full" onClick={doReschedule} disabled={busy}>{busy ? "Saving…" : "Save new time"}</button>
              <button className="btn btn--soft btn--full" onClick={() => setMode("actions")}>Back</button>
            </div>
          )}
        </div>
      </>
    );
  }

  function OwnerMessage({ studio, onBack, showToast, toast }) {
    const [clients, setClients] = useState(null);
    const [sel, setSel] = useState({}); // email -> bool
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
      (async () => {
        const list = window.SEY_BOOK ? await window.SEY_BOOK.getStudioClients(studio.id) : [];
        setClients(list);
        const all = {}; list.forEach((c) => { all[c.email] = true; });
        setSel(all);
      })();
    }, []);

    const chosen = Object.keys(sel).filter((e) => sel[e]);
    async function send() {
      if (!msg.trim() || !chosen.length) return;
      setBusy(true);
      const r = await window.SEY_BOOK.messageClients(msg.trim(), chosen);
      setBusy(false);
      if (r && (r.ok || r.sent != null)) { showToast("Sent to " + (r.sent != null ? r.sent : chosen.length)); onBack(); }
      else { showToast("Couldn’t send" + (r && r.error ? ": " + r.error : "")); }
    }

    return (
      <div className="app">
        <div className="topbar">
          <button className="iconbtn iconbtn--plain topbar-back" onClick={onBack} aria-label="Back"><Ic name="back" /></button>
          <div className="topbar-title">Message clients</div>
          <div className="topbar-spacer" />
        </div>
        <div className="app-scroll">
          <div className="screen">
            <p className="muted" style={{ marginTop: 4 }}>Send an update to your clients — e.g. “We’re now on book.sey.la, reserve your next visit online.” Only your own clients receive it.</p>
            <textarea rows={4} placeholder="Write your message…" value={msg} onChange={(e) => setMsg(e.target.value)}
              style={{ marginTop: 14, width: "100%", boxSizing: "border-box", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", color: "var(--ink)", background: "var(--surface)", resize: "vertical", outline: "none", minHeight: 96, display: "block" }} />
            <div className="sec-title" style={{ margin: "18px 0 8px" }}>
              <h2 className="h-md">Recipients ({chosen.length})</h2>
              {clients && clients.length > 0 && (
                <a onClick={() => { const allOn = chosen.length === clients.length; const next = {}; clients.forEach((c) => { next[c.email] = !allOn; }); setSel(next); }}>{chosen.length === clients.length ? "Clear all" : "Select all"}</a>
              )}
            </div>
            {clients === null ? <p className="muted tiny">Loading…</p>
              : clients.length === 0 ? <p className="muted tiny">No clients yet. They appear here once people book with you (or import them on the web panel).</p>
              : (
                <div className="block--flush">
                  {clients.map((c) => (
                    <div className="arow" key={c.email} onClick={() => setSel((s) => ({ ...s, [c.email]: !s[c.email] }))}>
                      <span className="arow-lb" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}<span className="tiny muted" style={{ display: "block" }}>{c.email}</span></span>
                      <span style={{ width: 24, height: 24, borderRadius: 7, border: "1.5px solid " + (sel[c.email] ? "var(--ink)" : "var(--line-strong)"), background: sel[c.email] ? "var(--ink)" : "transparent", display: "grid", placeItems: "center" }}>{sel[c.email] && <Ic name="check" size={15} color="var(--cream)" />}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
        <div className="ownerbar">
          <button className="btn btn--primary btn--full" onClick={send} disabled={busy || !msg.trim() || !chosen.length}>{busy ? "Sending…" : "Send to " + chosen.length + " client" + (chosen.length === 1 ? "" : "s")}</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  // ---------- ROOT ----------
  function App() {
    const [tab, setTab] = useState("home");
    const [stack, setStack] = useState([]); // overlay pages on top of the active tab
    const [favs, setFavs] = useState(() => load("favs", []));
    // "bookings2" — bumped from "bookings" to drop any demo bookings older builds
    // persisted to localStorage. Starts empty; only real local bookings are stored.
    const [bookings, setBookings] = useState(() => load("bookings2", []));
    const [joined, setJoined] = useState(() => load("joined", []));
    const [reviewed, setReviewed] = useState(() => load("reviewed", []));
    const [manage, setManage] = useState(null); // booking being managed (action sheet)
    const [showSplash, setShowSplash] = useState(true);
    const [user, setUser] = useState(() => load("user", null));
    const [authChecked, setAuthChecked] = useState(false); // resolved the initial session yet?
    const [ownerStudio, setOwnerStudio] = useState(undefined); // undefined=checking · null=not an owner · {…}=owner
    const [ownerMode, setOwnerMode] = useState(() => load("ownerMode", "pro")); // owners: 'pro' dashboard vs 'client' booking view
    useEffect(() => save("ownerMode", ownerMode), [ownerMode]);
    const [notif, setNotif] = useState(() => load("notif", true));
    const [toast, setToast] = useState(null);
    const [install, setInstall] = useState(false);

    useEffect(() => save("favs", favs), [favs]);
    useEffect(() => save("bookings2", bookings), [bookings]);
    useEffect(() => save("joined", joined), [joined]);
    useEffect(() => save("reviewed", reviewed), [reviewed]);
    useEffect(() => save("user", user), [user]);
    useEffect(() => save("notif", notif), [notif]);
    useEffect(() => { const t = setTimeout(() => setInstall(true), 2600); return () => clearTimeout(t); }, []);

    // Reconcile with a real Supabase session (shared from the site login / magic-link
    // return). Reflect a signed-in user; only clear on an explicit sign-out so a
    // persisted/demo user is never wiped on load.
    useEffect(() => {
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) { setAuthChecked(true); return; }
      const asUser = (u) => ({ name: u.email ? u.email.split("@")[0] : "Guest", phone: u.email || "", email: u.email || "", real: true });
      window.SEY_BOOK.getUser().then((u) => { if (u) setUser(asUser(u)); }).finally(() => setAuthChecked(true));
      const unsub = window.SEY_BOOK.onAuthChange((u, event) => {
        if (u) setUser(asUser(u));
        else if (event === "SIGNED_OUT") { setUser(null); setOwnerStudio(undefined); }
      });
      return unsub;
    }, []);

    // Owner detection — if the signed-in user owns a studio, they get the pro app.
    useEffect(() => {
      if (!user) { setOwnerStudio(undefined); return; }
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) { setOwnerStudio(null); return; }
      let cancelled = false;
      window.SEY_BOOK.getMyStudio().then((s) => { if (!cancelled) setOwnerStudio(s || null); }).catch(() => { if (!cancelled) setOwnerStudio(null); });
      return () => { cancelled = true; };
    }, [user]);

    // The signed-in customer's real visit history — for the "book again" home hub.
    const [myVisits, setMyVisits] = useState([]);
    const [visitsVer, setVisitsVer] = useState(0);
    useEffect(() => {
      if (!user || !(window.SEY_BOOK && window.SEY_BOOK.available())) { setMyVisits([]); return; }
      let cancelled = false;
      window.SEY_BOOK.getMyBookings().then((rows) => { if (!cancelled) setMyVisits(rows || []); }).catch(() => {});
      return () => { cancelled = true; };
    }, [user, visitsVer]);

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
    if (tab === "home") base = <Home nav={nav} favs={favs} toggleFav={toggleFav} setTab={switchTab} hasNotifs={upcoming > 0} visits={myVisits} />;
    else if (tab === "search") base = <Search nav={nav} favs={favs} toggleFav={toggleFav} />;
    else if (tab === "bookings") base = <Bookings bookings={bookings} nav={nav} onManage={setManage} reviewed={reviewed} />;
    else base = <Account user={user} setUser={setUser} favs={favs} nav={nav} notif={notif} setNotif={setNotif} isOwner={!!ownerStudio} onSwitchToPro={() => setOwnerMode("pro")} visitCount={myVisits.length} />;

    // top overlay
    const top = stack[stack.length - 1];
    let overlay = null;
    if (top) {
      const p = top.props;
      if (top.name === "studio") overlay = <Studio id={p.id} nav={nav} favs={favs} toggleFav={toggleFav} showToast={showToast} />;
      else if (top.name === "search") overlay = <div className="sheet-full"><TopBar title="Browse" onBack={nav.pop} /><div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}><Search nav={nav} favs={favs} toggleFav={toggleFav} initialCat={p.cat} /></div></div>;
      else if (top.name === "book") overlay = <BookFlow id={p.id} serviceId={p.serviceId} nav={nav} addBooking={addBooking} />;
      else if (top.name === "classJoin") overlay = <ClassJoin id={p.id} nav={nav} joinClass={joinClass} joinedIds={joined} />;
      else if (top.name === "classes") overlay = <Classes nav={nav} />;
      else if (top.name === "favs") overlay = <Favourites favs={favs} toggleFav={toggleFav} nav={nav} />;
      else if (top.name === "notif") overlay = <Notifications nav={nav} bookings={bookings} />;
      else if (top.name === "rewards") overlay = <Rewards nav={nav} />;
      else if (top.name === "invite") overlay = <Invite nav={nav} />;
      else if (top.name === "review") { const bk = bookings.find((b) => b.id === p.bookingId); overlay = <ReviewFlow booking={bk} nav={nav} onSubmit={(id) => setReviewed((r) => [...r, id])} />; }
      else if (top.name === "notifsettings") overlay = <NotifSettings nav={nav} />;
      else if (top.name === "language") overlay = <Language nav={nav} />;
    }

    // Auth gate — the PWA requires a signed-in account. Until we've resolved the
    // initial session, hold on the splash; then show login for signed-out visitors.
    if (!user) {
      return (
        <div className="app">
          {(showSplash || !authChecked) ? (
            <div className="splash" onAnimationEnd={() => setShowSplash(false)}>
              <div className="brand" style={{ fontSize: "1.7rem" }}><b>sey.la</b><span>|</span><i>book</i></div>
              <div className="tiny" style={{ opacity: 0.7 }}>Book your island ritual</div>
            </div>
          ) : (
            <Login onDone={setUser} />
          )}
          {toast && <div className="toast">{toast}</div>}
        </div>
      );
    }

    // Owner (studio pro) app. While we're still checking ownership, hold on the
    // splash so we don't flash the client home before switching.
    if (ownerStudio === undefined) {
      return (
        <div className="app">
          <div className="splash"><div className="brand" style={{ fontSize: "1.7rem" }}><b>sey.la</b><span>|</span><i>book</i></div><div className="tiny" style={{ opacity: 0.7 }}>Loading your studio…</div></div>
        </div>
      );
    }
    if (ownerStudio && ownerMode === "pro") {
      return <OwnerApp studio={ownerStudio}
        onSwitchToClient={() => setOwnerMode("client")}
        onLogout={() => { if (window.SEY_BOOK) window.SEY_BOOK.signOut(); setUser(null); setOwnerStudio(undefined); }} />;
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
