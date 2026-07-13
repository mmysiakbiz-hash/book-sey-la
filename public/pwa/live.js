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

  // Human "x ago" from an ISO date, for real review timestamps.
  function relTime(iso) {
    if (!iso) return "";
    var then = new Date(iso).getTime();
    if (isNaN(then)) return "";
    var days = Math.floor((Date.now() - then) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return days + " days ago";
    if (days < 30) { var w = Math.round(days / 7); return w + (w === 1 ? " week ago" : " weeks ago"); }
    if (days < 365) { var mo = Math.round(days / 30); return mo + (mo === 1 ? " month ago" : " months ago"); }
    var yr = Math.round(days / 365); return yr + (yr === 1 ? " year ago" : " years ago");
  }

  // A real upcoming-days strip (today + 7) for the booking flow: { d, n, dow }.
  function buildDays() {
    var out = [];
    var base = new Date();
    for (var i = 0; i < 8; i++) {
      var dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      var dow = (dt.getDay() + 6) % 7; // Mon=0..Sun=6
      var label = i === 0 ? "Today" : DAYLBL[dow];
      out.push({ d: label, n: String(dt.getDate()), dow: dow });
    }
    return out;
  }

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
        poa: s.price_eur == null,     // "price on request" — no price set
      };
    });
    // Opening hours — App reads s.hours as [[label, "9:00 – 18:00"], …] and s.todayIdx.
    var openRows = (r.business_hours || [])
      .filter(function (h) { return h && h.open_min != null && h.close_min != null && h.close_min > h.open_min; })
      .sort(function (a, b) { return a.day_of_week - b.day_of_week; });
    var hours = openRows.map(function (h) { return [DAYLBL[h.day_of_week] || "", hm(h.open_min) + " – " + hm(h.close_min)]; });
    var todayDow = (new Date().getDay() + 6) % 7; // JS Sun=0..Sat=6 → Mon=0..Sun=6
    var todayIdx = openRows.map(function (h) { return h.day_of_week; }).indexOf(todayDow);
    // Real reviews (if any) — mapped to the app's review shape. Empty → the
    // reviews tab is hidden rather than showing anything invented.
    var reviewsList = (r.reviews || [])
      .slice()
      .sort(function (a, b) { return new Date(b.created_at || 0) - new Date(a.created_at || 0); })
      .map(function (rv) {
        return { name: rv.guest_name || "Guest", when: relTime(rv.created_at), text: rv.text || "", av: "",
                 rating: Math.max(1, Math.min(5, Math.round(Number(rv.rating) || 5))) };
      })
      .filter(function (x) { return x.text; });
    var revCount = r.google_review_count || reviewsList.length;
    var rating = r.google_rating != null ? Number(r.google_rating)
      : (reviewsList.length ? Math.round((reviewsList.reduce(function (n, x) { return n + x.rating; }, 0) / reviewsList.length) * 10) / 10 : null);
    return {
      id: r.slug,
      dbId: r.id || null,             // real studios.id (uuid) — enables a real booking write
      name: r.name,
      cat: CAT[r.category] || "spa",
      area: r.address || r.island || "Seychelles",
      about: r.bio || r.tagline || "",
      rating: rating != null ? rating : null,
      reviews: revCount,
      reviews_list: reviewsList,
      distance: "",
      price: priceLevel(r.services),
      photo: photo,
      gallery: photos.map(withSuffix),
      hours: hours,
      todayIdx: todayIdx,
      // Real coordinates for the map (null when the studio hasn't set a location).
      lat: r.lat != null ? Number(r.lat) : null,
      lng: r.lng != null ? Number(r.lng) : null,
      tag: r.status === "verified" ? "Verified" : "Popular",
      // App reads the group label as g.g, so use the `g` key (matches the demo shape).
      services: items.length ? [{ g: r.category || "Services", items: items }] : [],
      staff: (r.staff || []).filter(function (p) { return p.active !== false; }).map(function (p) {
        return { id: p.id, name: p.name, role: p.role || "", rating: null,
                 av: p.photo_url || "",
                 services: Array.isArray(p.services) ? p.services : [] };
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
    encodeURIComponent("id,slug,name,category,island,address,lat,lng,bio,tagline,photos,google_rating,google_review_count,status,services(id,name,duration_min,price_eur,category,sort),staff(id,name,role,active,photo_url,services),business_hours(day_of_week,open_min,close_min),reviews(rating,text,guest_name,created_at)") +
    "&status=in.(active,verified)&order=google_rating.desc";

  var fetchStudios = fetch(url, { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON } })
    .then(function (r) { return r.ok ? r.json() : null; });

  withTimeout(fetchStudios, TIMEOUT_MS).then(function (rows) {
    try {
      if (window.SEY_DATA && Array.isArray(rows)) {
        // Fetch succeeded → use REAL data only (even if empty → empty state).
        // Only a hard fetch failure (rows === null) keeps the bundled demo so a
        // network blip doesn't blank the app.
        window.SEY_DATA.STUDIOS = rows.map(mapStudio);
        window.SEY_DATA.DAYS = buildDays();
        // These aren't wired to real per-user/per-studio sources in the PWA yet,
        // so show nothing rather than invented content. Reviews come per studio
        // (studio.reviews_list); bookings fill in as the user books.
        window.SEY_DATA.CLASSES = [];
        window.SEY_DATA.BOOKINGS = [];
        window.SEY_DATA.REVIEWS = [];
        window.SEY_DATA.LOYALTY = [];
        window.SEY_DATA.STAFF = [];
      }
    } catch (e) { /* keep demo data on error */ }
    loadApp();
  });
})();
