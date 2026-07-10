/* sey.la | book PWA — compiled from App.jsx (do not edit; edit App.jsx and re-transpile with @babel/preset-react classic runtime). */
// sey.la | book — mobile PWA. Full client app: discover, search+map, studio profile,
// booking flow, classes, bookings, favourites, account/OTP, notifications.
(function () {
  const {
    Ic,
    Stars
  } = window.SEY_UI;
  const D = window.SEY_DATA;
  const {
    useState,
    useEffect,
    useRef
  } = React;

  // ---------- persistence ----------
  const load = (k, f) => {
    try {
      return JSON.parse(localStorage.getItem("sey." + k)) ?? f;
    } catch {
      return f;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem("sey." + k, JSON.stringify(v));
    } catch {}
  };

  // ---------- small pieces ----------
  function TopBar({
    title,
    onBack,
    right,
    brand
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "topbar"
    }, onBack && /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain topbar-back",
      onClick: onBack,
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), brand ? /*#__PURE__*/React.createElement("div", {
      className: "brand"
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")) : /*#__PURE__*/React.createElement("div", {
      className: "topbar-title"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "topbar-spacer"
    }), right);
  }
  function StudioCard({
    s,
    onOpen,
    fav,
    onFav,
    wide
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: "scard",
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-photo"
    }, /*#__PURE__*/React.createElement("img", {
      src: s.photo,
      alt: s.name,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("span", {
      className: "scard-tag"
    }, s.tag), /*#__PURE__*/React.createElement("span", {
      className: "scard-fav" + (fav ? " is-on" : ""),
      role: "button",
      "aria-label": "Save",
      onClick: ev => {
        ev.stopPropagation();
        onFav(s.id);
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 18,
      fill: fav ? "var(--clay)" : "none",
      color: fav ? "var(--clay)" : "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "scard-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-name"
    }, s.name), /*#__PURE__*/React.createElement(Stars, {
      r: s.rating
    })), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 13,
      color: "var(--cocoa-40)"
    }), s.area, s.distance ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), s.distance) : null)));
  }
  function ClassCard({
    c,
    onJoin,
    joined
  }) {
    const pct = Math.round((c.cap - c.spots) / c.cap * 100);
    const low = c.spots <= 3;
    return /*#__PURE__*/React.createElement("div", {
      className: "class"
    }, /*#__PURE__*/React.createElement("div", {
      className: "class-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "class-time"
    }, /*#__PURE__*/React.createElement("div", {
      className: "t"
    }, c.time), /*#__PURE__*/React.createElement("div", {
      className: "d"
    }, c.day)), /*#__PURE__*/React.createElement("div", {
      className: "class-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, c.studio, " \xB7 ", c.instructor), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta"
    }, c.dur, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), c.level, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), "SCR ", c.price))), /*#__PURE__*/React.createElement("div", {
      className: "spots" + (low ? " spots--low" : "")
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "spots-lb"
    }, /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, /*#__PURE__*/React.createElement("b", null, c.spots, " spots"), " left of ", c.cap), /*#__PURE__*/React.createElement("button", {
      className: "srv-add" + (joined ? " is-on" : ""),
      onClick: () => onJoin(c)
    }, joined ? "Joined ✓" : "Join class")));
  }

  // ---------- HOME ----------
  function Home({
    nav,
    favs,
    toggleFav,
    setTab,
    notif
  }) {
    const near = D.STUDIOS;
    const rec = D.STUDIOS.slice().sort((a, b) => b.rating - a.rating);
    const hasStudios = D.STUDIOS.length > 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      brand: true,
      right: /*#__PURE__*/React.createElement("button", {
        className: "iconbtn iconbtn--plain bell",
        "aria-label": "Notifications",
        onClick: () => nav.push("notif")
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "bell"
      }), notif && /*#__PURE__*/React.createElement("span", {
        className: "dot"
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "block--flush fu"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Mah\xE9 \xB7 Praslin \xB7 La Digue"), /*#__PURE__*/React.createElement("h1", {
      className: "h-xl"
    }, "Book your island ritual.")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("button", {
      className: "searchfield",
      onClick: () => setTab("search")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "search",
      size: 20,
      color: "var(--cocoa-60)"
    }), "Studios, services, treatments\u2026")), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "catrail"
    }, D.CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "cat",
      onClick: () => nav.push("search", {
        cat: c.id
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "cat-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: c.icon,
      size: 26
    })), /*#__PURE__*/React.createElement("span", {
      className: "cat-lb"
    }, c.label))))), hasStudios ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Recommended"), /*#__PURE__*/React.createElement("a", {
      onClick: () => setTab("search")
    }, "See all")), /*#__PURE__*/React.createElement("div", {
      className: "hscroll"
    }, rec.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      wide: true,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    })))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Near you"), /*#__PURE__*/React.createElement("a", {
      onClick: () => setTab("search")
    }, "Map")), /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, near.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    }))))) : /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "spa",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, "No studios yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "6px 0 0"
      }
    }, "We're onboarding salons across Mah\xE9, Praslin & La Digue. Check back soon."))))));
  }

  // ---------- SEARCH (+ filters + map) ----------
  function Search({
    nav,
    favs,
    toggleFav,
    initialCat
  }) {
    const [cat, setCat] = useState(initialCat || "all");
    const [mode, setMode] = useState("list"); // list | map
    const [active, setActive] = useState(null);
    const list = cat === "all" ? D.STUDIOS : D.STUDIOS.filter(s => s.cat === cat);
    const cats = [{
      id: "all",
      label: "All"
    }].concat(D.CATEGORIES.map(c => ({
      id: c.id,
      label: c.label
    })));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "Browse",
      right: /*#__PURE__*/React.createElement("button", {
        className: "iconbtn iconbtn--plain",
        onClick: () => setMode(mode === "list" ? "map" : "list"),
        "aria-label": "Toggle map"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: mode === "list" ? "pin" : "filter"
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 4,
        paddingBottom: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "searchfield",
      onClick: () => {}
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "search",
      size: 20,
      color: "var(--cocoa-60)"
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search Beau Vallon\u2026",
      onClick: e => e.stopPropagation()
    })), /*#__PURE__*/React.createElement("div", {
      className: "chips",
      style: {
        marginTop: 12
      }
    }, cats.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "chip" + (cat === c.id ? " is-active" : ""),
      onClick: () => setCat(c.id)
    }, c.label)))), mode === "list" ? /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        margin: "2px 0 12px"
      }
    }, list.length, " studios \xB7 sorted by rating"), /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, list.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    }))))) : /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "map"
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-water"
    }), /*#__PURE__*/React.createElement("div", {
      className: "map-road",
      style: {
        left: "20%",
        top: 0,
        width: 3,
        height: "100%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "map-road",
      style: {
        left: 0,
        top: "48%",
        width: "100%",
        height: 3
      }
    }), list.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "pin-marker" + (active === s.id ? " is-active" : ""),
      style: {
        left: s.x + "%",
        top: s.y + "%"
      },
      onClick: () => setActive(s.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "pin-price"
    }, "\u2605 ", s.rating)))), active && (() => {
      const s = list.find(x => x.id === active) || D.STUDIOS.find(x => x.id === active);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14
        }
      }, /*#__PURE__*/React.createElement(StudioCard, {
        s: s,
        onOpen: () => nav.push("studio", {
          id: s.id
        }),
        fav: favs.includes(s.id),
        onFav: toggleFav
      }));
    })()));
  }

  // ---------- STUDIO PROFILE ----------
  function Studio({
    id,
    nav,
    favs,
    toggleFav
  }) {
    const s = D.STUDIOS.find(x => x.id === id);
    const classes = D.CLASSES.filter(c => c.studioId === id);
    const [tab, setTab] = useState("services");
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: s.photo.replace("w=600", "w=800"),
      alt: s.name,
      style: {
        width: "100%",
        height: 230,
        objectFit: "cover",
        filter: "var(--photo-filter)"
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn topbar-back",
      style: {
        position: "absolute",
        top: 14,
        left: 14
      },
      onClick: nav.pop,
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        position: "absolute",
        top: 14,
        right: 14
      },
      "aria-label": "Share"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "share",
      size: 19
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        position: "absolute",
        top: 14,
        right: 66
      },
      onClick: () => toggleFav(s.id),
      "aria-label": "Save"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 19,
      fill: favs.includes(s.id) ? "var(--clay)" : "none",
      color: favs.includes(s.id) ? "var(--clay)" : "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 100
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-tag",
      style: {
        position: "static",
        display: "inline-block",
        marginBottom: 8
      }
    }, s.tag), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta",
      style: {
        marginTop: 8,
        fontSize: "0.9rem"
      }
    }, /*#__PURE__*/React.createElement(Stars, {
      r: s.rating
    }), " ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink)"
      }
    }, s.rating), " (", s.reviews, ")", /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 13,
      color: "var(--cocoa-40)"
    }), s.area), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 12,
        lineHeight: 1.55
      }
    }, s.about), /*#__PURE__*/React.createElement("div", {
      className: "chips",
      style: {
        marginTop: 6,
        marginBottom: 4
      }
    }, ["services", classes.length ? "classes" : null, s.reviews_list && s.reviews_list.length ? "reviews" : null, "about"].filter(Boolean).map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "chip" + (tab === t ? " is-active" : ""),
      onClick: () => setTab(t),
      style: {
        textTransform: "capitalize"
      }
    }, t))), tab === "services" && s.services.map(g => /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      key: g.g
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, g.g), g.items.map(it => /*#__PURE__*/React.createElement("div", {
      className: "srv",
      key: it.id,
      onClick: () => nav.push("book", {
        id: s.id,
        serviceId: it.id
      })
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, it.name), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, it.dur)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "srv-price"
    }, "SCR ", it.price), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })))))), tab === "classes" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, classes.map(c => /*#__PURE__*/React.createElement(ClassCard, {
      key: c.id,
      c: c,
      joined: false,
      onJoin: cl => nav.push("classJoin", {
        id: cl.id
      })
    }))), tab === "reviews" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, (s.reviews_list || []).map((r, i) => /*#__PURE__*/React.createElement("div", {
      className: "review",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-head"
    }, r.av ? /*#__PURE__*/React.createElement("img", {
      className: "review-av",
      src: r.av,
      alt: ""
    }) : /*#__PURE__*/React.createElement("span", {
      className: "review-av",
      style: {
        display: "grid",
        placeItems: "center",
        background: "var(--blush)",
        color: "var(--clay)",
        fontWeight: 700
      }
    }, (r.name || "G").slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", null, r.name), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, r.when)), /*#__PURE__*/React.createElement("span", {
      className: "rating"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 13,
      fill: "var(--ink)",
      color: "var(--ink)"
    }), " ", r.rating, ".0")), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0,
        lineHeight: 1.5
      }
    }, r.text)))), tab === "about" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Opening hours"), s.hours.map((h, i) => /*#__PURE__*/React.createElement("div", {
      className: "hours-row" + (i === s.todayIdx ? " today" : ""),
      key: h[0]
    }, /*#__PURE__*/React.createElement("span", null, h[0], i === s.todayIdx ? " · Today" : ""), /*#__PURE__*/React.createElement("span", null, h[1]))), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        margin: "18px 0 8px"
      }
    }, "Gallery"), /*#__PURE__*/React.createElement("div", {
      className: "gallery"
    }, s.gallery.map((g, i) => /*#__PURE__*/React.createElement("img", {
      key: i,
      src: g,
      alt: "",
      loading: "lazy"
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "color-mix(in srgb, var(--surface) 94%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => nav.push("book", {
        id: s.id
      })
    }, "Book now")));
  }

  // Real bookable times for a studio on a given weekday (Mon=0..Sun=6), derived
  // from the studio's opening hours. Every 30 min inside the open window; empty
  // when the studio is closed that day. A real conflict is still validated by
  // /api/book on submit — this just stops us inventing availability.
  const SLOT_DOWLBL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function slotsForDay(s, dow) {
    if (dow == null) return [];
    const row = (s.hours || []).find(h => h[0] === SLOT_DOWLBL[dow]);
    if (!row) return [];
    const m = String(row[1]).match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
    if (!m) return [];
    const pad = n => String(n).padStart(2, "0");
    const start = +m[1] * 60 + +m[2];
    const end = +m[3] * 60 + +m[4];
    const out = [];
    for (let t = start; t + 30 <= end; t += 30) out.push(pad(Math.floor(t / 60)) + ":" + pad(t % 60));
    return out;
  }

  // ---------- BOOKING FLOW (service -> staff -> time -> payment -> confirm) ----------
  function BookFlow({
    id,
    serviceId,
    nav,
    addBooking,
    prefill
  }) {
    const s = D.STUDIOS.find(x => x.id === id);
    const allItems = s.services.flatMap(g => g.items);
    const staffPool = s.staff && s.staff.length ? s.staff : D.STAFF.slice(0, 3);
    const [picked, setPicked] = useState(serviceId ? [serviceId] : prefill ? prefill.picked : []);
    const [staff, setStaff] = useState("any");
    const [day, setDay] = useState(0);
    const [slot, setSlot] = useState(null);
    const [recurring, setRecurring] = useState(false);
    const [pay, setPay] = useState("salon"); // salon | now
    const [step, setStep] = useState(serviceId || prefill ? 1 : 0); // 0 svc,1 staff,2 time,3 pay
    const [done, setDone] = useState(false);
    const chosen = allItems.filter(it => picked.includes(it.id));
    const total = chosen.reduce((n, it) => n + it.price, 0);
    const deposit = pay === "now" ? Math.max(5, Math.round(total * 0.2)) : 0;
    const staffName = staff === "any" ? "Any professional" : (staffPool.find(p => p.id === staff) || {}).name;
    const TITLES = ["Choose services", "Choose professional", "Pick a time", "Payment"];
    function confirm() {
      // Instant local booking — offline/demo fallback + drives the PWA "My bookings" list.
      addBooking({
        id: "bk" + Date.now(),
        studioId: s.id,
        studio: s.name,
        area: s.area,
        service: chosen.map(c => c.name).join(", ") || "Appointment",
        staff: staffName,
        pay,
        deposit,
        recurring,
        when: (D.DAYS[day].d === "Today" ? "Today" : D.DAYS[day].d) + " · " + slot,
        price: total,
        status: "Confirmed",
        photo: s.photo,
        past: false
      });
      setDone(true);
      // Best-effort real write to Supabase (+ Brevo confirmation email) via /api/book.
      // Needs a live session (shared from the site login); silently no-ops otherwise.
      try {
        if (window.SEY_BOOK && s.dbId) {
          const first = chosen.find(c => c.sid) || null;
          // Interpret the picked day + slot as MAHÉ local time (UTC+4, no DST),
          // not the visitor's browser timezone.
          const now = new Date();
          const when = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day);
          const parts = (slot || "09:00").split(":");
          const pad = n => String(n).padStart(2, "0");
          const mahe = when.getFullYear() + "-" + pad(when.getMonth() + 1) + "-" + pad(when.getDate()) + "T" + pad(Number(parts[0]) || 9) + ":" + pad(Number(parts[1]) || 0) + ":00+04:00";
          const realStaff = staff !== "any" && s.staff && s.staff.some(p => p.id === staff) ? staff : null;
          window.SEY_BOOK.createBooking({
            studioDbId: s.dbId,
            serviceDbId: first ? first.sid : null,
            staffId: realStaff,
            startsAt: new Date(mahe).toISOString(),
            durationMin: first ? first.durMin : 60,
            priceEur: total
          });
        }
      } catch (e) {/* keep the local booking; never break the UI */}
    }
    if (done) {
      return /*#__PURE__*/React.createElement("div", {
        className: "sheet-full"
      }, /*#__PURE__*/React.createElement("div", {
        className: "app-scroll"
      }, /*#__PURE__*/React.createElement("div", {
        className: "confirm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "confirm-ic"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "check",
        size: 38,
        color: "var(--eucalyptus)"
      })), /*#__PURE__*/React.createElement("h1", {
        className: "h-lg"
      }, "You're booked"), /*#__PURE__*/React.createElement("p", {
        className: "muted",
        style: {
          margin: 0
        }
      }, "A confirmation is on its way. Free to cancel up to 12h before."), /*#__PURE__*/React.createElement("div", {
        className: "receipt"
      }, /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Studio"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, s.name)), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Service"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, chosen.map(c => c.name).join(", "))), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "With"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, staffName)), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "When"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, D.DAYS[day].d, " \xB7 ", slot, recurring ? " · repeats" : "")), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Payment"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, pay === "now" ? "SCR " + deposit + " deposit paid" : "Pay in salon")), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Total"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, "SCR ", total))))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn btn--primary btn--full",
        onClick: () => nav.reset("bookings")
      }, "View my bookings")));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: TITLES[step],
      onBack: step === 0 ? nav.pop : () => setStep(step - 1)
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 118
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stepdots"
    }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "stepdot" + (i <= step ? " is-on" : "")
    }))), /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        marginBottom: 4
      }
    }, s.name, " \xB7 ", s.area), step === 0 && s.services.map(g => /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      key: g.g
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, g.g), g.items.map(it => {
      const on = picked.includes(it.id);
      return /*#__PURE__*/React.createElement("div", {
        className: "srv",
        key: it.id
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "srv-name"
      }, it.name), /*#__PURE__*/React.createElement("div", {
        className: "srv-meta"
      }, it.dur, " \xB7 SCR ", it.price)), /*#__PURE__*/React.createElement("button", {
        className: "srv-add" + (on ? " is-on" : ""),
        onClick: () => setPicked(on ? picked.filter(p => p !== it.id) : [...picked, it.id])
      }, on ? "Added ✓" : "Add"));
    }))), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("button", {
      className: "staffcard" + (staff === "any" ? " is-on" : ""),
      onClick: () => setStaff("any")
    }, /*#__PURE__*/React.createElement("span", {
      className: "staff-any"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 20,
      color: "var(--ink)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, "Any professional"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Earliest availability")), staff === "any" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })), staffPool.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      className: "staffcard" + (staff === p.id ? " is-on" : ""),
      onClick: () => setStaff(p.id)
    }, p.av ? /*#__PURE__*/React.createElement("img", {
      src: p.av,
      alt: ""
    }) : /*#__PURE__*/React.createElement("span", {
      className: "staff-any"
    }, (p.name || "?").slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, p.name), p.role && /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, p.role)), p.rating ? /*#__PURE__*/React.createElement("span", {
      className: "rating",
      style: {
        marginRight: 6
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 13,
      fill: "var(--ink)",
      color: "var(--ink)"
    }), " ", p.rating) : null, staff === p.id && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Day", staff !== "any" ? " · " + staffName + "'s calendar" : ""), /*#__PURE__*/React.createElement("div", {
      className: "daystrip"
    }, D.DAYS.map((d, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "day" + (day === i ? " is-active" : ""),
      onClick: () => {
        setDay(i);
        setSlot(null);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "day-d"
    }, d.d), /*#__PURE__*/React.createElement("div", {
      className: "day-n"
    }, d.n))))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Available times"), (() => {
      const times = slotsForDay(s, (D.DAYS[day] || {}).dow);
      if (!times.length) return /*#__PURE__*/React.createElement("p", {
        className: "muted",
        style: {
          margin: 0
        }
      }, "Closed on this day \u2014 pick another.");
      return /*#__PURE__*/React.createElement("div", {
        className: "slotgrid"
      }, times.map(t => /*#__PURE__*/React.createElement("button", {
        key: t,
        className: "slot" + (slot === t ? " is-active" : ""),
        onClick: () => setSlot(t)
      }, t)));
    })()), /*#__PURE__*/React.createElement("label", {
      className: "togglerow"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Repeat this appointment"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Every 4 weeks \xB7 cancel anytime")), /*#__PURE__*/React.createElement("span", {
      className: "switch" + (recurring ? " is-on" : ""),
      onClick: () => setRecurring(!recurring)
    }, /*#__PURE__*/React.createElement("i", null)))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Payment"), /*#__PURE__*/React.createElement("button", {
      className: "paymethod" + (pay === "salon" ? " is-on" : ""),
      onClick: () => setPay("salon")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Pay in salon"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Free booking \xB7 pay after your visit")), pay === "salon" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "paymethod" + (pay === "now" ? " is-on" : ""),
      onClick: () => setPay("now")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "card",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Pay a deposit now"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Secures your slot \xB7 Visa \xB7\xB7\xB7\xB7 4291")), pay === "now" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paynote"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 16,
      color: "var(--eucalyptus)"
    }), " ", pay === "now" ? "SCR " + deposit + " deposit today, SCR " + (total - deposit) + " in salon. Refundable if you cancel 12h before." : "No card needed. A no-show may limit future free bookings."), /*#__PURE__*/React.createElement("div", {
      className: "receipt",
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, chosen.length, " service", chosen.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "SCR ", total)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "With"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, staffName)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "When"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, D.DAYS[day].d, " \xB7 ", slot)), deposit > 0 && /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Due now"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "SCR ", deposit)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "color-mix(in srgb, var(--surface) 94%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)"
      }
    }, step === 0 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: !picked.length,
      onClick: () => setStep(1)
    }, "Continue", total ? " · SCR " + total : ""), step === 1 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => setStep(2)
    }, "Continue"), step === 2 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: !slot,
      onClick: () => setStep(3)
    }, "Continue ", slot ? "· " + D.DAYS[day].d + " " + slot : ""), step === 3 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: confirm
    }, pay === "now" ? "Pay SCR " + deposit + " & confirm" : "Confirm booking")));
  }

  // ---------- CLASS JOIN ----------
  function ClassJoin({
    id,
    nav,
    joinClass,
    joinedIds
  }) {
    const c = D.CLASSES.find(x => x.id === id);
    const joined = joinedIds.includes(c.id);
    const pct = Math.round((c.cap - c.spots) / c.cap * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Group class",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "h-lg",
      style: {
        marginTop: 8
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        marginTop: 6
      }
    }, c.studio, " \xB7 ", c.instructor), /*#__PURE__*/React.createElement("div", {
      className: "receipt",
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "When"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.day, " \xB7 ", c.time)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Duration"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.dur)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Level"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.level)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Price"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "SCR ", c.price))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spots" + (c.spots <= 3 ? " spots--low" : "")
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "spots-lb"
    }, /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, /*#__PURE__*/React.createElement("b", null, c.spots, " spots"), " left of ", c.cap), /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, pct, "% full"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: joined,
      onClick: () => {
        joinClass(c);
        nav.pop();
      }
    }, joined ? "Already joined ✓" : "Join class · SCR " + c.price)));
  }

  // ---------- CLASSES LIST ----------
  function Classes({
    nav
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Group classes",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingTop: 6
      }
    }, D.CLASSES.length ? D.CLASSES.map(c => /*#__PURE__*/React.createElement(ClassCard, {
      key: c.id,
      c: c,
      joined: false,
      onJoin: cl => nav.push("classJoin", {
        id: cl.id
      })
    })) : /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "fitness",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "No classes yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Group classes will appear here as studios add them.")))));
  }

  // ---------- BOOKINGS ----------
  function Bookings({
    bookings,
    nav,
    onManage,
    reviewed
  }) {
    const [tab, setTab] = useState("upcoming");
    const up = bookings.filter(b => !b.past);
    const past = bookings.filter(b => b.past);
    const list = tab === "upcoming" ? up : past;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "My bookings"
    }), /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "chips"
    }, /*#__PURE__*/React.createElement("button", {
      className: "chip" + (tab === "upcoming" ? " is-active" : ""),
      onClick: () => setTab("upcoming")
    }, "Upcoming (", up.length, ")"), /*#__PURE__*/React.createElement("button", {
      className: "chip" + (tab === "past" ? " is-active" : ""),
      onClick: () => setTab("past")
    }, "History (", past.length, ")"))), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "Nothing here yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "When you book, it shows up here.")) : list.map(b => /*#__PURE__*/React.createElement("div", {
      key: b.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk",
      onClick: () => b.past ? nav.push("studio", {
        id: b.studioId
      }) : onManage(b)
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: b.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, b.when), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, b.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, b.studio, " \xB7 SCR ", b.price)), /*#__PURE__*/React.createElement("span", {
      className: "status " + (b.past ? "status--past" : "status--ok")
    }, b.status)), b.past && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--sm",
      onClick: () => nav.push("book", {
        id: b.studioId
      })
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 15
    }), " Book again"), reviewed.includes(b.id) ? /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        display: "flex",
        gap: 5,
        alignItems: "center",
        alignSelf: "center"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 14,
      color: "var(--eucalyptus)"
    }), " Reviewed") : /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--sm",
      onClick: () => nav.push("review", {
        bookingId: b.id
      })
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 15
    }), " Review")))), tab === "upcoming" && up.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "clock",
      size: 14,
      color: "var(--eucalyptus)"
    }), " Tap a booking to reschedule or cancel \xB7 free up to 12h before."))));
  }

  // ---------- FAVOURITES ----------
  function Favourites({
    favs,
    toggleFav,
    nav
  }) {
    const list = D.STUDIOS.filter(s => favs.includes(s.id));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Favourites",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "No favourites yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Tap the heart on any studio to save it.")) : /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, list.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: true,
      onFav: toggleFav
    }))))));
  }

  // ---------- NOTIFICATIONS ----------
  function Notifications({
    nav
  }) {
    const items = [{
      ic: "calendar",
      t: "Reminder: Coconut & frangipani massage",
      s: "Tomorrow at 14:30 · Kreol Spa",
      when: "2h ago",
      dot: true
    }, {
      ic: "check",
      t: "Booking confirmed",
      s: "Sunrise beach yoga · Sat 07:00",
      when: "1d ago",
      dot: true
    }, {
      ic: "sparkle",
      t: "A slot opened at L'Accent Barber",
      s: "Today 16:00 — you were watching this",
      when: "2d ago"
    }, {
      ic: "heart",
      t: "Lumière Nails added a new service",
      s: "BIAB overlay · SCR 42",
      when: "5d ago"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Notifications",
      onBack: nav.pop,
      right: /*#__PURE__*/React.createElement("button", {
        className: "iconbtn iconbtn--plain",
        "aria-label": "Settings",
        onClick: () => nav.push("notifsettings")
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "shield",
        size: 20
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, items.map((n, i) => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: n.ic,
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: "var(--ink)"
      }
    }, n.t), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        marginTop: 2
      }
    }, n.s)), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        whiteSpace: "nowrap"
      }
    }, n.when))))));
  }

  // ---------- ACCOUNT + LOGIN/OTP ----------
  function Account({
    user,
    setUser,
    favs,
    nav,
    notif,
    setNotif
  }) {
    if (!user) return /*#__PURE__*/React.createElement(Login, {
      onDone: setUser
    });
    const rows = [{
      ic: "sparkle",
      lb: "Rewards & stamps",
      go: () => nav.push("rewards")
    }, {
      ic: "calendar",
      lb: "Messages",
      go: () => nav.push("messages")
    }, {
      ic: "card",
      lb: "Packages & gift cards",
      go: () => nav.push("packages")
    }, {
      ic: "clock",
      lb: "Waitlist",
      go: () => nav.push("waitlist")
    }, {
      ic: "heart",
      lb: "Favourites",
      go: () => nav.push("favs")
    }, {
      ic: "sparkle",
      lb: "Invite a studio · €15",
      go: () => nav.push("invite")
    }, {
      ic: "bell",
      lb: "Notifications",
      go: () => nav.push("notif")
    }, {
      ic: "card",
      lb: "Payment methods",
      go: () => nav.push("payments")
    }, {
      ic: "globe",
      lb: "Language · English",
      go: () => nav.push("language")
    }, {
      ic: "help",
      lb: "Help & support"
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "Account"
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 0 18px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "avatar",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, user.name), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, user.phone))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, favs.length), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, "Saved")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, "4.9"), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, "Your rating"))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, rows.map(r => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: r.lb,
      onClick: r.go
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: r.ic,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "arow-lb"
    }, r.lb), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "arow",
      onClick: () => setNotif(!notif)
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "bell",
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "arow-lb"
    }, "Push reminders"), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 28,
        borderRadius: 999,
        background: notif ? "var(--ink)" : "var(--line-strong)",
        position: "relative",
        transition: "background .2s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 3,
        left: notif ? 21 : 3,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#fff",
        transition: "left .2s"
      }
    })))), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      style: {
        marginTop: 18
      },
      onClick: () => {
        if (window.SEY_BOOK) window.SEY_BOOK.signOut();
        setUser(null);
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "logout",
      size: 18
    }), " Log out"), /*#__PURE__*/React.createElement("p", {
      className: "tiny muted",
      style: {
        textAlign: "center",
        marginTop: 20
      }
    }, "sey.la | book \xB7 always free for clients", /*#__PURE__*/React.createElement("br", null), "Operated by Nexora Consulting LLC"))));
  }
  function Login({
    onDone
  }) {
    // Email magic-link login (Supabase). No phone/SMS — we're email-only.
    const [email, setEmail] = useState("");
    const [estate, setEstate] = useState("idle"); // idle | sending | sent | error
    const [emsg, setEmsg] = useState("");
    async function sendLink() {
      const addr = email.trim();
      if (!addr) return;
      setEstate("sending");
      const api = typeof window !== "undefined" && window.SEY_BOOK;
      const res = api ? await window.SEY_BOOK.sendMagicLink(addr) : {
        error: "supabase_unavailable"
      };
      if (res && res.ok) {
        setEstate("sent");
      } else {
        setEstate("error");
        setEmsg(res && res.error || "error");
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 40
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand",
      style: {
        fontSize: "1.4rem",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), estate === "sent" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Check your email"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 8
      }
    }, "We sent a magic link to ", /*#__PURE__*/React.createElement("b", null, email.trim()), ". Open it on this device to sign in \u2014 you'll come right back here."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      style: {
        marginTop: 22
      },
      onClick: () => setEstate("idle")
    }, "Use a different email")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Log in or sign up"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 8
      }
    }, "Enter your email \u2014 we'll send a magic link. No password, and booking is always free."), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "email",
      inputMode: "email",
      autoComplete: "email",
      placeholder: "you@email.com",
      value: email,
      onChange: e => setEmail(e.target.value),
      onKeyDown: e => {
        if (e.key === "Enter") sendLink();
      }
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      style: {
        marginTop: 18
      },
      disabled: estate === "sending" || !email.trim(),
      onClick: sendLink
    }, estate === "sending" ? "Sending…" : "Send magic link"), estate === "error" && /*#__PURE__*/React.createElement("p", {
      className: "tiny",
      style: {
        color: "var(--clay)",
        marginTop: 12
      }
    }, "Couldn't send the link (", emsg, "). Please try again."), /*#__PURE__*/React.createElement("p", {
      className: "tiny muted",
      style: {
        marginTop: 16,
        lineHeight: 1.5
      }
    }, "By continuing you agree to the Terms and Privacy Policy."))));
  }

  // ---------- LOYALTY / REWARDS ----------
  function LoyaltyCard({
    l
  }) {
    const cells = Array.from({
      length: l.need
    }, (_, i) => i);
    return /*#__PURE__*/React.createElement("div", {
      className: "loy"
    }, /*#__PURE__*/React.createElement("div", {
      className: "loy-head"
    }, /*#__PURE__*/React.createElement("img", {
      src: l.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, l.studio), /*#__PURE__*/React.createElement("div", {
      className: "loy-progress"
    }, l.have, " of ", l.need, " visits")), /*#__PURE__*/React.createElement(Stars, {
      r: 5
    })), /*#__PURE__*/React.createElement("div", {
      className: "loy-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stamps"
    }, cells.map(i => {
      const on = i < l.have,
        reward = i === l.need - 1;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "stamp" + (on ? " is-on" : "") + (reward && !on ? " is-reward" : "")
      }, reward ? /*#__PURE__*/React.createElement(Ic, {
        name: "sparkle",
        size: 16,
        color: on ? "#fff" : "var(--clay)"
      }) : on ? /*#__PURE__*/React.createElement(Ic, {
        name: "check",
        size: 15,
        color: "#fff"
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700
        }
      }, i + 1));
    })), /*#__PURE__*/React.createElement("div", {
      className: "loy-reward"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 16,
      color: "var(--clay)"
    }), " Reward: ", l.reward)));
  }
  function Rewards({
    nav
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Rewards",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 2px"
      }
    }, "Collect a stamp on every visit. Rewards apply automatically at checkout."), D.LOYALTY.length ? D.LOYALTY.map(l => /*#__PURE__*/React.createElement(LoyaltyCard, {
      key: l.studioId,
      l: l
    })) : /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "No rewards yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Book with a studio that runs a loyalty card and your stamps show up here.")))));
  }

  // ---------- POST-VISIT REVIEW ----------
  function ReviewFlow({
    booking,
    nav,
    onSubmit
  }) {
    const [r, setR] = useState(5);
    const [txt, setTxt] = useState("");
    const [done, setDone] = useState(false);
    if (done) return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 34,
      color: "var(--eucalyptus)",
      fill: "var(--eucalyptus)"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Thank you"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Your review helps other island guests find great studios."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: nav.pop
    }, "Done")));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Leave a review",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk",
      style: {
        cursor: "default"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: booking.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, booking.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, booking.studio, " \xB7 ", booking.when))), /*#__PURE__*/React.createElement("div", {
      className: "starrow"
    }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("button", {
      key: n,
      className: n <= r ? "is-on" : "",
      onClick: () => setR(n),
      "aria-label": n + " stars"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 34,
      fill: n <= r ? "var(--clay)" : "none",
      color: n <= r ? "var(--clay)" : "var(--line-strong)"
    })))), /*#__PURE__*/React.createElement("textarea", {
      className: "reviewtext",
      placeholder: "Tell others about your visit (optional)\u2026",
      value: txt,
      onChange: e => setTxt(e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => {
        onSubmit(booking.id);
        setDone(true);
      }
    }, "Submit review")));
  }

  // ---------- INVITE A STUDIO -> WALLET ----------
  function Invite({
    nav
  }) {
    const [copied, setCopied] = useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Invite a studio",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wallet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Your wallet"), /*#__PURE__*/React.createElement("div", {
      className: "wallet-amt"
    }, "\u20AC15"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Credit toward any booking")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Know a great studio?"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 6
      }
    }, "Invite a salon, spa or barber to join sey.la | book. When they go live, you both get ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink)"
      }
    }, "\u20AC15"), " in credit.")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        marginBottom: 8,
        fontWeight: 600
      }
    }, "Your invite code"), /*#__PURE__*/React.createElement("div", {
      className: "invite-code"
    }, "AMELIA-15", /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm btn--soft",
      onClick: () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }, copied ? "Copied ✓" : "Copy"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "share",
      size: 18,
      color: "var(--cream)"
    }), " Share invite")));
  }

  // ---------- BOOKING ACTION SHEET (cancel / reschedule) ----------
  function BookingActions({
    booking,
    onClose,
    onCancel,
    onReschedule,
    onViewStudio
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sheet-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sheet actionsheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 4px 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, booking.when), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, booking.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub muted"
    }, booking.studio)), /*#__PURE__*/React.createElement("button", {
      className: "act",
      onClick: onReschedule
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 20
    })), "Reschedule"), /*#__PURE__*/React.createElement("button", {
      className: "act",
      onClick: onViewStudio
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 20
    })), "View studio"), /*#__PURE__*/React.createElement("button", {
      className: "act danger",
      onClick: onCancel
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic",
      style: {
        background: "var(--blush)"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "close",
      size: 19,
      color: "var(--clay)"
    })), "Cancel booking"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      style: {
        marginTop: 12
      },
      onClick: onClose
    }, "Keep booking")));
  }

  // ---------- WAITLIST ----------
  function Waitlist({
    nav
  }) {
    const [items, setItems] = useState([{
      id: "w1",
      studio: "L'Accent Barber",
      studioId: "laccent",
      slot: "Today · 16:00",
      svc: "Skin fade & beard",
      photo: D.STUDIOS.find(s => s.id === "laccent").photo,
      on: true
    }, {
      id: "w2",
      studio: "Kreol Spa",
      studioId: "kreol-spa",
      slot: "Sat · morning",
      svc: "Coconut & frangipani massage",
      photo: D.STUDIOS.find(s => s.id === "kreol-spa").photo,
      on: true
    }]);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Waitlist",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 12px"
      }
    }, "We'll notify you the moment a slot frees up. Booking still free \u2014 first to tap gets it."), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "clock",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, "No waitlists"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Tap \"Join waitlist\" on a full time slot.")) : items.map(w => /*#__PURE__*/React.createElement("div", {
      className: "bk",
      key: w.id,
      style: {
        cursor: "default",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: w.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, w.slot), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, w.svc), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, w.studio)), /*#__PURE__*/React.createElement("span", {
      className: "switch" + (w.on ? " is-on" : ""),
      onClick: () => setItems(items.map(x => x.id === w.id ? {
        ...x,
        on: !x.on
      } : x))
    }, /*#__PURE__*/React.createElement("i", null)))))));
  }

  // ---------- PACKAGES & GIFT CARDS ----------
  function Packages({
    nav
  }) {
    const owned = [{
      id: "p1",
      name: "5× Coconut massage",
      studio: "Kreol Spa",
      left: 2,
      total: 5,
      exp: "Exp. Dec 2026"
    }, {
      id: "p2",
      name: "Unlimited yoga · monthly",
      studio: "North Shore Fitness",
      left: "∞",
      total: "∞",
      exp: "Renews 1 Aug"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Packages & gift cards",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wallet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Gift card balance"), /*#__PURE__*/React.createElement("div", {
      className: "wallet-amt"
    }, "\u20AC40"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Use at any sey.la studio")), /*#__PURE__*/React.createElement("div", {
      className: "sec-title",
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Your packages")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, owned.map(p => /*#__PURE__*/React.createElement("div", {
      className: "loy",
      key: p.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "loy-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "staff-any"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "loy-progress"
    }, p.studio, " \xB7 ", p.exp)), /*#__PURE__*/React.createElement("span", {
      className: "tagpill loyal"
    }, p.left, " left"))))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Buy")), /*#__PURE__*/React.createElement("button", {
      className: "paymethod",
      onClick: () => nav.push("giftbuy")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Send a gift card"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "\u20AC25 \xB7 \u20AC50 \xB7 \u20AC100")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "paymethod",
      onClick: () => nav.push("studio", {
        id: "kreol-spa"
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Buy a service package"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Save up to 20% vs single visits")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    }))))));
  }
  function GiftBuy({
    nav
  }) {
    const [amt, setAmt] = useState(50);
    const [done, setDone] = useState(false);
    if (done) return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 34,
      color: "var(--eucalyptus)",
      fill: "var(--eucalyptus)"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Gift on its way"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "A \u20AC", amt, " sey.la gift card has been sent."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: nav.pop
    }, "Done")));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Send a gift card",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 10
      }
    }, "Amount"), /*#__PURE__*/React.createElement("div", {
      className: "slotgrid",
      style: {
        gridTemplateColumns: "repeat(3,1fr)"
      }
    }, [25, 50, 100].map(v => /*#__PURE__*/React.createElement("button", {
      key: v,
      className: "slot" + (amt === v ? " is-active" : ""),
      onClick: () => setAmt(v)
    }, "\u20AC", v))), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "field-prefix"
    }, "To"), /*#__PURE__*/React.createElement("input", {
      placeholder: "Recipient's phone or email"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Message (optional)"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => setDone(true)
    }, "Pay \u20AC", amt, " & send")));
  }

  // ---------- MESSAGES ----------
  function Messages({
    nav
  }) {
    const threads = [{
      id: "kreol-spa",
      studio: "Kreol Spa",
      photo: D.STUDIOS.find(s => s.id === "kreol-spa").photo,
      last: "See you tomorrow at 14:30 🌺",
      when: "2h",
      unread: true
    }, {
      id: "laccent",
      studio: "L'Accent Barber",
      photo: D.STUDIOS.find(s => s.id === "laccent").photo,
      last: "A slot opened at 16:00 today",
      when: "1d",
      unread: false
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Messages",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 4
      }
    }, threads.map(t => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: t.id,
      onClick: () => nav.push("thread", {
        id: t.id
      })
    }, /*#__PURE__*/React.createElement("img", {
      className: "avatar",
      style: {
        width: 46,
        height: 46
      },
      src: t.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, t.studio), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta",
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, t.last)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, t.when), t.unread && /*#__PURE__*/React.createElement("span", {
      className: "dotsep",
      style: {
        width: 8,
        height: 8,
        background: "var(--clay)",
        marginTop: 4
      }
    })))))));
  }
  function Thread({
    id,
    nav
  }) {
    const st = D.STUDIOS.find(s => s.id === id);
    const [msgs, setMsgs] = useState([{
      me: false,
      t: "Hi Amelia! Confirming your massage tomorrow at 14:30 with Aline 🌺"
    }, {
      me: true,
      t: "Perfect, thank you! Any parking nearby?"
    }, {
      me: false,
      t: "Yes — free spots right by the beach entrance."
    }]);
    const [txt, setTxt] = useState("");
    function send() {
      if (!txt.trim()) return;
      setMsgs([...msgs, {
        me: true,
        t: txt
      }]);
      setTxt("");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: st.name,
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 76
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "msgbubble" + (m.me ? " me" : "")
    }, m.t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom,0px))",
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "field",
      style: {
        flex: 1,
        height: 46
      },
      value: txt,
      onChange: e => setTxt(e.target.value),
      placeholder: "Message\u2026",
      onKeyDown: e => {
        if (e.key === "Enter") send();
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        width: 46,
        height: 46,
        background: "var(--ink)",
        color: "var(--cream)",
        border: "none"
      },
      onClick: send
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "arrowRight",
      size: 20,
      color: "var(--cream)"
    }))));
  }

  // ---------- NOTIFICATION SETTINGS ----------
  function NotifSettings({
    nav
  }) {
    const EVENTS = [{
      id: "confirm",
      lb: "Booking confirmation"
    }, {
      id: "r24",
      lb: "Reminder · 24h before"
    }, {
      id: "r2",
      lb: "Reminder · 2h before"
    }, {
      id: "change",
      lb: "Changes & cancellations"
    }, {
      id: "wait",
      lb: "Waitlist — a slot opened"
    }, {
      id: "promo",
      lb: "Offers & promotions"
    }];
    const CH = ["push", "sms", "email"];
    const [prefs, setPrefs] = useState(() => {
      const base = {};
      EVENTS.forEach(e => base[e.id] = {
        push: true,
        sms: e.id !== "promo",
        email: e.id === "confirm" || e.id === "change"
      });
      return base;
    });
    const toggle = (e, c) => setPrefs(p => ({
      ...p,
      [e]: {
        ...p[e],
        [c]: !p[e][c]
      }
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Notification settings",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 10px"
      }
    }, "Choose how each update reaches you. Reminders help you never miss a visit."), /*#__PURE__*/React.createElement("div", {
      className: "notifmatrix-head"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, "Push"), /*#__PURE__*/React.createElement("span", null, "SMS"), /*#__PURE__*/React.createElement("span", null, "Email")), EVENTS.map(e => /*#__PURE__*/React.createElement("div", {
      className: "notifrow",
      key: e.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "notifrow-lb"
    }, e.lb), CH.map(c => /*#__PURE__*/React.createElement("span", {
      key: c,
      className: "minicheck" + (prefs[e.id][c] ? " is-on" : ""),
      role: "checkbox",
      "aria-checked": prefs[e.id][c],
      "aria-label": e.lb + " " + c,
      onClick: () => toggle(e.id, c)
    }, prefs[e.id][c] && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 14,
      color: "var(--cream)"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "paynote",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 16,
      color: "var(--eucalyptus)"
    }), " We'll always send a confirmation and any cancellation, even if muted, so you're never caught out."))));
  }

  // ---------- LANGUAGE ----------
  function Language({
    nav
  }) {
    const [lang, setLang] = useState(() => load("lang", "en"));
    const opts = [["en", "English", "English"], ["fr", "Français", "French"], ["crs", "Kreol Seselwa", "Seychellois Creole"]];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Language",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 12px"
      }
    }, "Choose your language. Studio names and services stay as the studio wrote them."), opts.map(o => /*#__PURE__*/React.createElement("button", {
      key: o[0],
      className: "paymethod" + (lang === o[0] ? " is-on" : ""),
      onClick: () => {
        setLang(o[0]);
        save("lang", o[0]);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "globe",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, o[1]), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, o[2])), lang === o[0] && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    }))))));
  }

  // ---------- PAYMENT METHODS ----------
  function PaymentMethods({
    nav
  }) {
    const [cards, setCards] = useState([{
      id: 1,
      brand: "Visa",
      last: "4291",
      exp: "08/27",
      def: true
    }]);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Payment methods",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 12px"
      }
    }, "Used for deposits and no-show protection. Booking itself is always free."), cards.map(c => /*#__PURE__*/React.createElement("div", {
      className: "paymethod is-on",
      key: c.id,
      style: {
        cursor: "default"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "card",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, c.brand, " \xB7\xB7\xB7\xB7 ", c.last), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Expires ", c.exp, c.def ? " · Default" : "")))), /*#__PURE__*/React.createElement("button", {
      className: "paymethod",
      onClick: () => setCards([...cards, {
        id: Date.now(),
        brand: "Mastercard",
        last: "8830",
        exp: "05/28"
      }])
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Add a card"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Visa \xB7 Mastercard \xB7 Amex")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Balances"), /*#__PURE__*/React.createElement("div", {
      className: "receipt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Gift card"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC40")), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Invite wallet"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC15")))), /*#__PURE__*/React.createElement("div", {
      className: "paynote",
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 16,
      color: "var(--eucalyptus)"
    }), " A no-show or a late cancel (under 12h) may charge the studio's fee. You'll always see it before you book."))));
  }

  // ---------- TAB BAR ----------
  function TabBar({
    tab,
    setTab,
    upcoming
  }) {
    const tabs = [{
      id: "home",
      ic: "home",
      lb: "Home"
    }, {
      id: "search",
      ic: "search",
      lb: "Search"
    }, {
      id: "bookings",
      ic: "calendar",
      lb: "Bookings"
    }, {
      id: "account",
      ic: "user",
      lb: "Account"
    }];
    return /*#__PURE__*/React.createElement("nav", {
      className: "tabbar"
    }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: "tab" + (tab === t.id ? " is-active" : ""),
      onClick: () => setTab(t.id)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: t.ic,
      size: 24,
      sw: tab === t.id ? 2.1 : 1.75
    }), t.id === "bookings" && upcoming > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -3,
        right: -8,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        borderRadius: 999,
        background: "var(--clay)",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        display: "grid",
        placeItems: "center"
      }
    }, upcoming)), /*#__PURE__*/React.createElement("span", {
      className: "tab-lb"
    }, t.lb))));
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
    useEffect(() => {
      const t = setTimeout(() => setInstall(true), 2600);
      return () => clearTimeout(t);
    }, []);

    // Reconcile with a real Supabase session (shared from the site login / magic-link
    // return). Reflect a signed-in user; only clear on an explicit sign-out so a
    // persisted/demo user is never wiped on load.
    useEffect(() => {
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) return;
      const asUser = u => ({
        name: u.email ? u.email.split("@")[0] : "Guest",
        phone: u.email || "",
        email: u.email || "",
        real: true
      });
      window.SEY_BOOK.getUser().then(u => {
        if (u) setUser(asUser(u));
      });
      const unsub = window.SEY_BOOK.onAuthChange((u, event) => {
        if (u) setUser(asUser(u));else if (event === "SIGNED_OUT") setUser(null);
      });
      return unsub;
    }, []);
    const showToast = m => {
      setToast(m);
      setTimeout(() => setToast(null), 1800);
    };
    const nav = {
      push: (name, props) => setStack(s => [...s, {
        name,
        props: props || {}
      }]),
      pop: () => setStack(s => s.slice(0, -1)),
      reset: toTab => {
        setStack([]);
        if (toTab) setTab(toTab);
      }
    };
    const toggleFav = id => setFavs(f => {
      const on = f.includes(id);
      showToast(on ? "Removed from favourites" : "Saved to favourites");
      return on ? f.filter(x => x !== id) : [...f, id];
    });
    const addBooking = b => setBookings(v => [b, ...v]);
    const cancelBooking = id => {
      setBookings(v => v.filter(b => b.id !== id));
      setManage(null);
      showToast("Booking cancelled");
    };
    const joinClass = c => {
      setJoined(j => [...j, c.id]);
      addBooking({
        id: "bk" + Date.now(),
        studioId: c.studioId,
        studio: c.studio,
        area: "",
        service: c.name + " · class",
        when: c.day + " · " + c.time,
        price: c.price,
        status: "Confirmed",
        photo: D.STUDIOS.find(s => s.id === c.studioId).photo,
        past: false
      });
      showToast("You joined the class");
    };
    const switchTab = t => {
      setStack([]);
      setTab(t);
    };
    const upcoming = bookings.filter(b => !b.past).length;

    // active tab screen
    let base;
    if (tab === "home") base = /*#__PURE__*/React.createElement(Home, {
      nav: nav,
      favs: favs,
      toggleFav: toggleFav,
      setTab: switchTab,
      notif: notif
    });else if (tab === "search") base = /*#__PURE__*/React.createElement(Search, {
      nav: nav,
      favs: favs,
      toggleFav: toggleFav
    });else if (tab === "bookings") base = /*#__PURE__*/React.createElement(Bookings, {
      bookings: bookings,
      nav: nav,
      onManage: setManage,
      reviewed: reviewed
    });else base = /*#__PURE__*/React.createElement(Account, {
      user: user,
      setUser: setUser,
      favs: favs,
      nav: nav,
      notif: notif,
      setNotif: setNotif
    });

    // top overlay
    const top = stack[stack.length - 1];
    let overlay = null;
    if (top) {
      const p = top.props;
      if (top.name === "studio") overlay = /*#__PURE__*/React.createElement(Studio, {
        id: p.id,
        nav: nav,
        favs: favs,
        toggleFav: toggleFav
      });else if (top.name === "search") overlay = /*#__PURE__*/React.createElement("div", {
        className: "sheet-full"
      }, /*#__PURE__*/React.createElement(TopBar, {
        title: "Browse",
        onBack: nav.pop
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement(Search, {
        nav: nav,
        favs: favs,
        toggleFav: toggleFav,
        initialCat: p.cat
      })));else if (top.name === "book") overlay = /*#__PURE__*/React.createElement(BookFlow, {
        id: p.id,
        serviceId: p.serviceId,
        nav: nav,
        addBooking: addBooking
      });else if (top.name === "classJoin") overlay = /*#__PURE__*/React.createElement(ClassJoin, {
        id: p.id,
        nav: nav,
        joinClass: joinClass,
        joinedIds: joined
      });else if (top.name === "classes") overlay = /*#__PURE__*/React.createElement(Classes, {
        nav: nav
      });else if (top.name === "favs") overlay = /*#__PURE__*/React.createElement(Favourites, {
        favs: favs,
        toggleFav: toggleFav,
        nav: nav
      });else if (top.name === "notif") overlay = /*#__PURE__*/React.createElement(Notifications, {
        nav: nav
      });else if (top.name === "rewards") overlay = /*#__PURE__*/React.createElement(Rewards, {
        nav: nav
      });else if (top.name === "invite") overlay = /*#__PURE__*/React.createElement(Invite, {
        nav: nav
      });else if (top.name === "review") {
        const bk = bookings.find(b => b.id === p.bookingId);
        overlay = /*#__PURE__*/React.createElement(ReviewFlow, {
          booking: bk,
          nav: nav,
          onSubmit: id => setReviewed(r => [...r, id])
        });
      } else if (top.name === "waitlist") overlay = /*#__PURE__*/React.createElement(Waitlist, {
        nav: nav
      });else if (top.name === "packages") overlay = /*#__PURE__*/React.createElement(Packages, {
        nav: nav
      });else if (top.name === "giftbuy") overlay = /*#__PURE__*/React.createElement(GiftBuy, {
        nav: nav
      });else if (top.name === "messages") overlay = /*#__PURE__*/React.createElement(Messages, {
        nav: nav
      });else if (top.name === "thread") overlay = /*#__PURE__*/React.createElement(Thread, {
        id: p.id,
        nav: nav
      });else if (top.name === "notifsettings") overlay = /*#__PURE__*/React.createElement(NotifSettings, {
        nav: nav
      });else if (top.name === "payments") overlay = /*#__PURE__*/React.createElement(PaymentMethods, {
        nav: nav
      });else if (top.name === "language") overlay = /*#__PURE__*/React.createElement(Language, {
        nav: nav
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, showSplash && /*#__PURE__*/React.createElement("div", {
      className: "splash",
      onAnimationEnd: () => setShowSplash(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand",
      style: {
        fontSize: "1.7rem"
      }
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.7
      }
    }, "Book your island ritual")), base, overlay, !top && /*#__PURE__*/React.createElement(TabBar, {
      tab: tab,
      setTab: switchTab,
      upcoming: upcoming
    }), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast"
    }, toast), manage && /*#__PURE__*/React.createElement(BookingActions, {
      booking: manage,
      onClose: () => setManage(null),
      onCancel: () => cancelBooking(manage.id),
      onViewStudio: () => {
        const m = manage;
        setManage(null);
        nav.push("studio", {
          id: m.studioId
        });
      },
      onReschedule: () => {
        const m = manage;
        setManage(null);
        nav.push("book", {
          id: m.studioId
        });
        showToast("Pick a new time");
      }
    }), install && !top && /*#__PURE__*/React.createElement("div", {
      className: "install"
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic",
      style: {
        background: "rgba(255,255,255,0.14)",
        color: "var(--cream)"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "home",
      size: 20,
      color: "var(--cream)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700
      }
    }, "Install sey.la | book"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Add to home screen \xB7 works offline")), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm",
      onClick: () => {
        setInstall(false);
        showToast("Look for 'Add to Home Screen'");
      }
    }, "Add"), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain",
      style: {
        width: 32,
        height: 32,
        color: "var(--cream)"
      },
      onClick: () => setInstall(false),
      "aria-label": "Dismiss"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "close",
      size: 18,
      color: "var(--cream)"
    }))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();