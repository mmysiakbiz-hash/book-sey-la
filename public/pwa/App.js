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

  // ---------- real map (Leaflet + OpenStreetMap, loaded on demand) ----------
  const SEY_CENTER = [-4.62, 55.45]; // Mahé
  let _leafletPromise = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (_leafletPromise) return _leafletPromise;
    _leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector("link[data-leaflet]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "1");
        document.head.appendChild(link);
      }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.setAttribute("data-leaflet", "1");
      s.onload = () => resolve(window.L);
      s.onerror = reject;
      document.body.appendChild(s);
    });
    return _leafletPromise;
  }

  // A real OSM map with a pin per studio that has coordinates. onSelect(id) fires
  // when a pin is tapped. Falls back to a friendly note if Leaflet can't load.
  function MapView({
    studios,
    activeId,
    onSelect
  }) {
    const elRef = useRef(null);
    const mapRef = useRef(null);
    const [failed, setFailed] = useState(false);
    const pins = (studios || []).filter(s => typeof s.lat === "number" && typeof s.lng === "number");
    useEffect(() => {
      let cancelled = false;
      loadLeaflet().then(L => {
        if (cancelled || !elRef.current) return;
        if (!mapRef.current) {
          mapRef.current = L.map(elRef.current, {
            scrollWheelZoom: false,
            attributionControl: false
          }).setView(SEY_CENTER, 11);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
          }).addTo(mapRef.current);
        }
        const map = mapRef.current;
        (map._seyMarkers || []).forEach(m => map.removeLayer(m));
        map._seyMarkers = [];
        const coords = [];
        pins.forEach(s => {
          const icon = L.divIcon({
            className: "sey-pin" + (s.id === activeId ? " is-active" : ""),
            html: "<span></span>",
            iconSize: [24, 24],
            iconAnchor: [12, 22]
          });
          const m = L.marker([s.lat, s.lng], {
            icon
          }).addTo(map);
          m.on("click", () => onSelect && onSelect(s.id));
          map._seyMarkers.push(m);
          coords.push([s.lat, s.lng]);
        });
        if (coords.length === 1) map.setView(coords[0], 14);else if (coords.length > 1) map.fitBounds(coords, {
          padding: [40, 40],
          maxZoom: 14
        });
        setTimeout(() => {
          try {
            map.invalidateSize();
          } catch (e) {}
        }, 60);
      }).catch(() => {
        if (!cancelled) setFailed(true);
      });
      return () => {
        cancelled = true;
      };
    }, [studios, activeId]);
    useEffect(() => () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {}
        mapRef.current = null;
      }
    }, []);
    if (failed) return /*#__PURE__*/React.createElement("div", {
      className: "map",
      style: {
        display: "grid",
        placeItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "muted tiny",
      style: {
        padding: 20,
        textAlign: "center"
      }
    }, "Map couldn\u2019t load. Check your connection and try again."));
    return /*#__PURE__*/React.createElement("div", {
      ref: elRef,
      className: "map-live",
      style: {
        position: "absolute",
        inset: 0
      }
    });
  }

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
    }, s.photo ? /*#__PURE__*/React.createElement("img", {
      src: s.photo,
      alt: s.name,
      loading: "lazy"
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "var(--blush)",
        color: "var(--clay)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "2rem"
      }
    }, (s.name || "?").trim().charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("span", {
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
      name: "search",
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
    }, /*#__PURE__*/React.createElement(MapView, {
      studios: list,
      activeId: active,
      onSelect: setActive
    }), list.every(s => typeof s.lat !== "number" || typeof s.lng !== "number") && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 14,
        right: 14,
        top: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        background: "rgba(252,248,242,0.94)",
        padding: "8px 12px",
        borderRadius: 999,
        textAlign: "center"
      }
    }, "Studios appear on the map once they\u2019ve set their location.")), active && (() => {
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
    }, it.poa ? "On request" : "SCR " + it.price), /*#__PURE__*/React.createElement(Ic, {
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
    // Only offer staff who perform every chosen service (empty list = does all).
    const chosenNames = chosen.map(c => c.name);
    const eligibleStaff = staffPool.filter(p => !(p.services && p.services.length) || chosenNames.every(n => p.services.includes(n)));
    const staffName = staff === "any" ? "Any professional" : (staffPool.find(p => p.id === staff) || {}).name;
    const TITLES = ["Choose services", "Choose professional", "Pick a time", "Review"];
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
      }, "On site \xB7 cash or card")), /*#__PURE__*/React.createElement("div", {
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
      }, it.dur, " \xB7 ", it.poa ? "On request" : "SCR " + it.price)), /*#__PURE__*/React.createElement("button", {
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
    })), eligibleStaff.map(p => /*#__PURE__*/React.createElement("button", {
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
      className: "paynote"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 16,
      color: "var(--eucalyptus)"
    }), " Pay the studio directly on the day \u2014 cash or card. No online payment, no card needed."), /*#__PURE__*/React.createElement("div", {
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
    }, D.DAYS[day].d, " \xB7 ", slot)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Pay"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "On site \xB7 cash or card")))))), /*#__PURE__*/React.createElement("div", {
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
    }, "Confirm booking")));
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
    nav,
    bookings
  }) {
    // Real notifications only: a reminder for each of your upcoming bookings.
    // No bookings → nothing to show (a logged-out visitor sees an empty state).
    const items = (bookings || []).filter(b => !b.past).map(b => ({
      ic: "calendar",
      t: "Reminder: " + b.service,
      s: [b.when, b.studio].filter(Boolean).join(" · ")
    }));
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
    }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "bell",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "No notifications yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Booking reminders and updates will show up here.")) : items.map((n, i) => /*#__PURE__*/React.createElement("div", {
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
    }, n.s)))))));
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
      className: "login-hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "login-bg"
    }), /*#__PURE__*/React.createElement("div", {
      className: "login-scrim"
    }), /*#__PURE__*/React.createElement("div", {
      className: "login-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand login-brand"
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), /*#__PURE__*/React.createElement("div", {
      className: "login-tag"
    }, "Beauty & wellness,", /*#__PURE__*/React.createElement("br", null), "booked across the islands.")), /*#__PURE__*/React.createElement("div", {
      className: "login-card"
    }, estate === "sent" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
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
        marginTop: 6
      }
    }, "Enter your email \u2014 we'll send a magic link. No password, and booking is always free."), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 18
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
        marginTop: 14
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
        marginTop: 14,
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

  // ---------- OWNER (STUDIO PRO) MODE ----------
  // A simplified pro app for studio owners: a day-by-day agenda of bookings,
  // reschedule / cancel, and a message-your-clients composer. (Full setup —
  // services, hours, team, billing — stays on the web panel.)
  const MTZ = "Indian/Mahe";
  const mDayKey = d => d.toLocaleDateString("en-CA", {
    timeZone: MTZ
  });
  const mDayLabel = d => d.toLocaleDateString("en-GB", {
    timeZone: MTZ,
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  const mTime = d => d.toLocaleTimeString("en-GB", {
    timeZone: MTZ,
    hour: "2-digit",
    minute: "2-digit"
  });
  function OwnerApp({
    studio,
    onLogout
  }) {
    const [agenda, setAgenda] = useState(null);
    const [sel, setSel] = useState(0);
    const [view, setView] = useState("agenda"); // agenda | message
    const [sheet, setSheet] = useState(null); // booking action sheet
    const [toast, setToast] = useState(null);
    const showToast = m => {
      setToast(m);
      setTimeout(() => setToast(null), 1800);
    };
    const days = React.useMemo(() => Array.from({
      length: 14
    }, (_, i) => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return d;
    }), []);
    async function reload() {
      const rows = window.SEY_BOOK ? await window.SEY_BOOK.getStudioAgenda(studio.id) : [];
      setAgenda(rows);
    }
    useEffect(() => {
      reload(); /* eslint-disable-next-line */
    }, []);
    const dayList = (agenda || []).filter(b => mDayKey(b.start) === mDayKey(days[sel])).sort((a, b) => a.start - b.start);
    const countFor = d => (agenda || []).filter(b => mDayKey(b.start) === mDayKey(d)).length;
    if (view === "message") return /*#__PURE__*/React.createElement(OwnerMessage, {
      studio: studio,
      onBack: () => setView("agenda"),
      showToast: showToast,
      toast: toast
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("div", {
      className: "topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "topbar-title",
      style: {
        fontWeight: 700
      }
    }, studio.name || "Your studio"), /*#__PURE__*/React.createElement("div", {
      className: "topbar-spacer"
    }), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain",
      onClick: onLogout,
      "aria-label": "Log out"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "logout"
    }))), studio.status !== "active" && /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6,
        paddingBottom: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        background: "var(--blush)",
        color: "var(--clay)",
        padding: "10px 12px",
        borderRadius: 12
      }
    }, "Your page isn\u2019t published yet. Finish setup on book.sey.la to go live.")), /*#__PURE__*/React.createElement("div", {
      className: "ownerdays"
    }, days.map((d, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "ownerday" + (i === sel ? " is-on" : ""),
      onClick: () => setSel(i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ownerday-dow"
    }, i === 0 ? "Today" : d.toLocaleDateString("en-GB", {
      timeZone: MTZ,
      weekday: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "ownerday-num"
    }, d.toLocaleDateString("en-GB", {
      timeZone: MTZ,
      day: "numeric"
    })), countFor(d) > 0 && /*#__PURE__*/React.createElement("span", {
      className: "ownerday-dot"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title",
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, mDayLabel(days[sel])), /*#__PURE__*/React.createElement("span", {
      className: "muted tiny"
    }, dayList.length, " booking", dayList.length === 1 ? "" : "s")), agenda === null ? /*#__PURE__*/React.createElement("p", {
      className: "muted tiny"
    }, "Loading\u2026") : dayList.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "40px 10px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 26,
      color: "var(--cocoa-40)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginTop: 12
      }
    }, "No bookings"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 4
      }
    }, "Nothing booked for this day yet.")) : /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, dayList.map(b => /*#__PURE__*/React.createElement("button", {
      key: b.id,
      className: "apptrow",
      onClick: () => setSheet(b)
    }, /*#__PURE__*/React.createElement("div", {
      className: "apptrow-time"
    }, mTime(b.start)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, b.client), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, b.service, b.staff ? " · " + b.staff : "", b.price != null ? " · SCR " + Math.round(b.price) : "")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "ownerbar"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => setView("message")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "bell",
      size: 18,
      color: "var(--cream)"
    }), " Message clients")), sheet && /*#__PURE__*/React.createElement(OwnerBookingSheet, {
      booking: sheet,
      onClose: () => setSheet(null),
      onReschedule: async (startISO, dur) => {
        const r = await window.SEY_BOOK.ownerReschedule(sheet.id, startISO, dur);
        if (r.error) {
          showToast("Couldn’t move: " + r.error);
        } else {
          showToast("Rescheduled");
          setSheet(null);
          reload();
        }
      },
      onCancel: async () => {
        const r = await window.SEY_BOOK.ownerCancel(sheet.id);
        if (r.error) {
          showToast("Couldn’t cancel");
        } else {
          showToast("Cancelled");
          setSheet(null);
          reload();
        }
      }
    }), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast"
    }, toast));
  }
  function OwnerBookingSheet({
    booking,
    onClose,
    onReschedule,
    onCancel
  }) {
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
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sheet-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 4px 6px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, booking.client), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, booking.service, booking.staff ? " · " + booking.staff : "", " \xB7 ", mDayLabel(booking.start), " ", mTime(booking.start))), booking.phone && mode === "actions" && /*#__PURE__*/React.createElement("a", {
      className: "act",
      href: "tel:" + booking.phone,
      style: {
        textDecoration: "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 20
    })), "Call ", booking.phone), mode === "actions" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "act",
      onClick: () => setMode("reschedule")
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 20
    })), "Reschedule"), /*#__PURE__*/React.createElement("button", {
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
    }, "Close")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: 10,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "ofield",
      type: "date",
      value: date,
      onChange: e => setDate(e.target.value)
    }), /*#__PURE__*/React.createElement("input", {
      className: "ofield",
      type: "time",
      value: time,
      onChange: e => setTime(e.target.value)
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: doReschedule,
      disabled: busy
    }, busy ? "Saving…" : "Save new time"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      onClick: () => setMode("actions")
    }, "Back"))));
  }
  function OwnerMessage({
    studio,
    onBack,
    showToast,
    toast
  }) {
    const [clients, setClients] = useState(null);
    const [sel, setSel] = useState({}); // email -> bool
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => {
      (async () => {
        const list = window.SEY_BOOK ? await window.SEY_BOOK.getStudioClients(studio.id) : [];
        setClients(list);
        const all = {};
        list.forEach(c => {
          all[c.email] = true;
        });
        setSel(all);
      })();
    }, []);
    const chosen = Object.keys(sel).filter(e => sel[e]);
    async function send() {
      if (!msg.trim() || !chosen.length) return;
      setBusy(true);
      const r = await window.SEY_BOOK.messageClients(msg.trim(), chosen);
      setBusy(false);
      if (r && (r.ok || r.sent != null)) {
        showToast("Sent to " + (r.sent != null ? r.sent : chosen.length));
        onBack();
      } else {
        showToast("Couldn’t send" + (r && r.error ? ": " + r.error : ""));
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("div", {
      className: "topbar"
    }, /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain topbar-back",
      onClick: onBack,
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), /*#__PURE__*/React.createElement("div", {
      className: "topbar-title"
    }, "Message clients"), /*#__PURE__*/React.createElement("div", {
      className: "topbar-spacer"
    })), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 4
      }
    }, "Send an update to your clients \u2014 e.g. \u201CWe\u2019re now on book.sey.la, reserve your next visit online.\u201D Only your own clients receive it."), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      rows: 4,
      placeholder: "Write your message\u2026",
      value: msg,
      onChange: e => setMsg(e.target.value),
      style: {
        width: "100%",
        boxSizing: "border-box",
        border: "none",
        background: "transparent",
        font: "inherit",
        color: "var(--ink)",
        resize: "vertical",
        outline: "none"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "sec-title",
      style: {
        margin: "18px 0 8px"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Recipients (", chosen.length, ")"), clients && clients.length > 0 && /*#__PURE__*/React.createElement("a", {
      onClick: () => {
        const allOn = chosen.length === clients.length;
        const next = {};
        clients.forEach(c => {
          next[c.email] = !allOn;
        });
        setSel(next);
      }
    }, chosen.length === clients.length ? "Clear all" : "Select all")), clients === null ? /*#__PURE__*/React.createElement("p", {
      className: "muted tiny"
    }, "Loading\u2026") : clients.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "muted tiny"
    }, "No clients yet. They appear here once people book with you (or import them on the web panel).") : /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, clients.map(c => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: c.email,
      onClick: () => setSel(s => ({
        ...s,
        [c.email]: !s[c.email]
      }))
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-lb",
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, c.name, /*#__PURE__*/React.createElement("span", {
      className: "tiny muted",
      style: {
        display: "block"
      }
    }, c.email)), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 7,
        border: "1.5px solid " + (sel[c.email] ? "var(--ink)" : "var(--line-strong)"),
        background: sel[c.email] ? "var(--ink)" : "transparent",
        display: "grid",
        placeItems: "center"
      }
    }, sel[c.email] && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 15,
      color: "var(--cream)"
    }))))))), /*#__PURE__*/React.createElement("div", {
      className: "ownerbar"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: send,
      disabled: busy || !msg.trim() || !chosen.length
    }, busy ? "Sending…" : "Send to " + chosen.length + " client" + (chosen.length === 1 ? "" : "s"))), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast"
    }, toast));
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
    const [notif, setNotif] = useState(() => load("notif", true));
    const [toast, setToast] = useState(null);
    const [install, setInstall] = useState(false);
    useEffect(() => save("favs", favs), [favs]);
    useEffect(() => save("bookings2", bookings), [bookings]);
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
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) {
        setAuthChecked(true);
        return;
      }
      const asUser = u => ({
        name: u.email ? u.email.split("@")[0] : "Guest",
        phone: u.email || "",
        email: u.email || "",
        real: true
      });
      window.SEY_BOOK.getUser().then(u => {
        if (u) setUser(asUser(u));
      }).finally(() => setAuthChecked(true));
      const unsub = window.SEY_BOOK.onAuthChange((u, event) => {
        if (u) setUser(asUser(u));else if (event === "SIGNED_OUT") {
          setUser(null);
          setOwnerStudio(undefined);
        }
      });
      return unsub;
    }, []);

    // Owner detection — if the signed-in user owns a studio, they get the pro app.
    useEffect(() => {
      if (!user) {
        setOwnerStudio(undefined);
        return;
      }
      if (!(window.SEY_BOOK && window.SEY_BOOK.available())) {
        setOwnerStudio(null);
        return;
      }
      let cancelled = false;
      window.SEY_BOOK.getMyStudio().then(s => {
        if (!cancelled) setOwnerStudio(s || null);
      }).catch(() => {
        if (!cancelled) setOwnerStudio(null);
      });
      return () => {
        cancelled = true;
      };
    }, [user]);
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
        nav: nav,
        bookings: bookings
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
      } else if (top.name === "notifsettings") overlay = /*#__PURE__*/React.createElement(NotifSettings, {
        nav: nav
      });else if (top.name === "language") overlay = /*#__PURE__*/React.createElement(Language, {
        nav: nav
      });
    }

    // Auth gate — the PWA requires a signed-in account. Until we've resolved the
    // initial session, hold on the splash; then show login for signed-out visitors.
    if (!user) {
      return /*#__PURE__*/React.createElement("div", {
        className: "app"
      }, showSplash || !authChecked ? /*#__PURE__*/React.createElement("div", {
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
      }, "Book your island ritual")) : /*#__PURE__*/React.createElement(Login, {
        onDone: setUser
      }), toast && /*#__PURE__*/React.createElement("div", {
        className: "toast"
      }, toast));
    }

    // Owner (studio pro) app. While we're still checking ownership, hold on the
    // splash so we don't flash the client home before switching.
    if (ownerStudio === undefined) {
      return /*#__PURE__*/React.createElement("div", {
        className: "app"
      }, /*#__PURE__*/React.createElement("div", {
        className: "splash"
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
      }, "Loading your studio\u2026")));
    }
    if (ownerStudio) {
      return /*#__PURE__*/React.createElement(OwnerApp, {
        studio: ownerStudio,
        onLogout: () => {
          if (window.SEY_BOOK) window.SEY_BOOK.signOut();
          setUser(null);
          setOwnerStudio(undefined);
        }
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