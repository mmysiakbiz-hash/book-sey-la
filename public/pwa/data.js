// sey.la | book PWA — mock data. Exposed on window for the Babel app scripts.
(function () {
  const U = "https://images.unsplash.com/photo-";
  const q = "?auto=format&fit=crop&w=600&q=70";

  const CATEGORIES = [
    { id: "hair", label: "Hair", icon: "hair" },
    { id: "nails", label: "Nails", icon: "nails" },
    { id: "spa", label: "Spa & massage", icon: "spa" },
    { id: "barber", label: "Barber", icon: "barber" },
    { id: "brows", label: "Brows & lashes", icon: "brows" },
    { id: "makeup", label: "Makeup", icon: "makeup" },
    { id: "skin", label: "Facials", icon: "skin" },
    { id: "waxing", label: "Waxing", icon: "waxing" },
    { id: "tattoo", label: "Tattoo", icon: "tattoo" },
    { id: "piercing", label: "Piercing", icon: "piercing" },
    { id: "fitness", label: "Fitness & yoga", icon: "fitness" },
    { id: "trainer", label: "Personal training", icon: "trainer" },
  ];

  // No demo studios. Real studios are loaded from Supabase by live.js; if that
  // fetch fails we show an honest empty state rather than invented salons.
  const STUDIOS = [];

  // User-specific data is never seeded with demo content — a logged-out user
  // must see nothing fake. Real classes come per studio; bookings fill in as the
  // user books; reviews come from each studio (studio.reviews_list).
  const CLASSES = [];
  const BOOKINGS = [];
  const REVIEWS = [];

  const DAYS = [
    { d: "Today", n: "3" }, { d: "Thu", n: "4" }, { d: "Fri", n: "5" }, { d: "Sat", n: "6" },
    { d: "Sun", n: "7" }, { d: "Mon", n: "8" }, { d: "Tue", n: "9" }, { d: "Wed", n: "10" },
  ];
  const SLOTS = ["09:00","10:00","11:00","12:30","14:00","14:30","16:00","17:15","18:00","18:45","19:15","20:00"];
  const TAKEN = ["12:30","16:00","19:15"];

  const LOYALTY = [];
  const STAFF = [];

  window.SEY_DATA = { CATEGORIES, STUDIOS, CLASSES, BOOKINGS, REVIEWS, DAYS, SLOTS, TAKEN, LOYALTY, STAFF };
})();
