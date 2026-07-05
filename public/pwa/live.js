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

  function mapStudio(r, i) {
    var photos = Array.isArray(r.photos) ? r.photos : [];
    var photo = photos[0] || "";
    if (photo && photo.indexOf("?") === -1) photo += "?auto=format&fit=crop&w=600&q=70";
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
    return {
      id: r.slug,
      dbId: r.id || null,             // real studios.id (uuid) — enables a real booking write
      name: r.name,
      cat: CAT[r.category] || "spa",
      area: r.address || r.island || "Seychelles",
      rating: r.google_rating != null ? Number(r.google_rating) : 4.8,
      reviews: r.google_review_count || 0,
      distance: "",
      price: priceLevel(r.services),
      photo: photo,
      x: 28 + ((i * 13) % 48),
      y: 22 + ((i * 17) % 52),
      tag: r.status === "verified" ? "Verified" : "Popular",
      services: items.length ? [{ group: r.category || "Services", items: items }] : [],
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
    encodeURIComponent("id,slug,name,category,island,address,photos,google_rating,google_review_count,status,services(id,name,duration_min,price_eur,category,sort)") +
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
