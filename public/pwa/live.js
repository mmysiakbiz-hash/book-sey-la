/* sey.la | book PWA — live data bootstrap.
   Fetches studios from Supabase, maps them into the app's studio shape, overwrites
   window.SEY_DATA.studios, then loads the app. Falls back to the bundled demo data
   if Supabase is slow/unreachable (short timeout) so the app always mounts fast. */
(function () {
  var SUPABASE_URL = "https://eoapvjnaievxqkbmtxar.supabase.co";
  var SUPABASE_ANON = "sb_publishable_tZhLyNftU_iSMfZnu5NyOQ_Ht2h2GN6";
  var TIMEOUT_MS = 2500;

  // DB category label -> PWA category id
  var CAT = {
    "Hair": "hair", "Nails": "nails", "Spa & massage": "spa", "Spa & Wellness": "spa",
    "Barber": "barber", "Brows & lashes": "brows", "Makeup": "makeup",
    "Skin & facial": "skin", "Facials": "skin", "Waxing": "waxing", "Tattoo": "tattoo",
    "Piercing": "piercing", "Fitness & yoga": "fitness", "Personal trainer": "trainer",
  };

  function priceLevel(services) {
    if (!services || !services.length) return "€€";
    var min = Math.min.apply(null, services.map(function (s) { return Number(s.price_eur) || 999; }));
    return min < 30 ? "€" : min < 55 ? "€€" : "€€€";
  }

  var DAYLBL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // day_of_week 0..6
  function hm(m) { return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0"); }
  function withSuffix(u) { return u && u.indexOf("?") === -1 ? u + "?auto=format&fit=crop&w=600&q=70" : (u || ""); }

  function mapStudio(r, i) {
    var photos = Array.isArray(r.photos) ? r.photos : [];
    var photo = withSuffix(photos[0] || "");
    var svc = (r.services || []).slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
    var items = svc.map(function (s, k) {
      return {
        id: r.slug + "-s" + k,
        sid: s.id || null,            // real services.id (uuid) — enables a real booking write
        name: s.name,
        dur: (s.duration_min || 60) + " min",
        durMin: s.duration_min || 60,
        price: Number(s.price_eur) || 0,
      };
    });
    // Opening hours — App reads s.hours as [[label, "9:00 – 18:00"], …] and s.todayIdx.
    var openRows = (r.business_hours || [])
      .filter(function (h) { return h && h.open_min != null && h.close_min != null && h.close_min > h.open_min; })
      .sort(function (a, b) { return a.day_of_week - b.day_of_week; });
    var hours = openRows.map(function (h) { return [DAYLBL[h.day_of_week] || "", hm(h.open_min) + " – " + hm(h.close_min)]; });
    var todayDow = (new Date().getDay() + 6) % 7; // JS Sun=0..Sat=6 → Mon=0..Sun=6
    var todayIdx = openRows.map(function (h) { return h.day_of_week; }).indexOf(todayDow);
    return {
      id: r.slug,
      dbId: r.id || null,             // real studios.id (uuid) — enables a real booking write
      name: r.name,
      cat: CAT[r.category] || "spa",
      area: r.address || r.island || "Seychelles",
      about: r.bio || r.tagline || "",
      rating: r.google_rating != null ? Number(r.google_rating) : 4.8,
      reviews: r.google_review_count || 0,
      distance: "",
      price: priceLevel(r.services),
      photo: photo,
      gallery: photos.map(withSuffix),
      hours: hours,
      todayIdx: todayIdx,
      x: 28 + ((i * 13) % 48),
      y: 22 + ((i * 17) % 52),
      tag: r.status === "verified" ? "Verified" : "Popular",
      // App reads the group label as g.g, so use the `g` key (matches the demo shape).
      services: items.length ? [{ g: r.category || "Services", items: items }] : [],
      staff: (r.staff || []).filter(function (p) { return p.active !== false; }).map(function (p) {
        return { id: p.id, name: p.name, role: p.role || "", rating: null, av: "" };
      }),
    };
  }

  function loadApp() {
    var s = document.createElement("script");
    s.src = "App.js";
    document.body.appendChild(s);
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, ms);
      promise.then(function (v) { if (!done) { done = true; clearTimeout(t); resolve(v); } })
             .catch(function () { if (!done) { done = true; clearTimeout(t); resolve(null); } });
    });
  }

  var url = SUPABASE_URL + "/rest/v1/studios?select=" +
    encodeURIComponent("id,slug,name,category,island,address,bio,tagline,photos,google_rating,google_review_count,status,services(id,name,duration_min,price_eur,category,sort),staff(id,name,role,active),business_hours(day_of_week,open_min,close_min)") +
    "&status=in.(active,verified)&order=google_rating.desc";

  var fetchStudios = fetch(url, { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON } })
    .then(function (r) { return r.ok ? r.json() : null; });

  withTimeout(fetchStudios, TIMEOUT_MS).then(function (rows) {
    try {
      if (rows && rows.length && window.SEY_DATA) {
        // The app reads SEY_DATA.STUDIOS (uppercase).
        window.SEY_DATA.STUDIOS = rows.map(mapStudio);
      }
    } catch (e) { /* keep demo data */ }
    loadApp();
  });
})();
