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

  const STUDIOS = [
    {
      id: "kreol-spa", name: "Kreol Spa", cat: "spa", area: "Beau Vallon, Mahé",
      rating: 4.9, reviews: 328, distance: "1.2 km", price: "€€", tag: "Verified",
      photo: U + "1600334129128-685c5582fd35" + q, x: 34, y: 40,
      about: "An island spa on Beau Vallon beach — Creole rituals with coconut, frangipani and volcanic clay.",
      hours: [["Mon","9:00 – 19:00"],["Tue","9:00 – 19:00"],["Wed","9:00 – 19:00"],["Thu","9:00 – 20:00"],["Fri","9:00 – 20:00"],["Sat","8:00 – 20:00"],["Sun","10:00 – 16:00"]],
      todayIdx: 3,
      gallery: [U+"1544161515-4ab6ce6db874"+q, U+"1519823551278-64ac92734fb1"+q, U+"1596178065887-1198b6148b2b"+q, U+"1540555700478-4be289fbecef"+q, U+"1571019613454-1cb2f99b2d8b"+q, U+"1560750588-73207b1ef5b8"+q],
      services: [
        { g: "Massage", items: [
          { id: "s1", name: "Coconut & frangipani massage", dur: "60 min", price: 55 },
          { id: "s2", name: "Hot stone therapy", dur: "75 min", price: 65 },
          { id: "s3", name: "Deep tissue", dur: "60 min", price: 58 },
        ]},
        { g: "Face", items: [
          { id: "s4", name: "Signature Creole facial", dur: "50 min", price: 48 },
          { id: "s5", name: "Express glow facial", dur: "30 min", price: 32 },
        ]},
      ],
    },
    {
      id: "north-shore-fit", name: "North Shore Fitness", cat: "trainer", area: "Glacis, Mahé",
      rating: 4.8, reviews: 141, distance: "3.4 km", price: "€€", tag: "Classes",
      photo: U + "1571902943202-507ec2618e8f" + q, x: 60, y: 22,
      about: "Small-group training and sunrise beach yoga above the north coast.",
      hours: [["Mon","6:00 – 20:00"],["Tue","6:00 – 20:00"],["Wed","6:00 – 20:00"],["Thu","6:00 – 20:00"],["Fri","6:00 – 20:00"],["Sat","7:00 – 13:00"],["Sun","Closed"]],
      todayIdx: 3,
      gallery: [U+"1534438327276-14e5300c3a48"+q, U+"1518611012118-696072aa579a"+q, U+"1506126613408-eca07ce68773"+q],
      services: [
        { g: "Training", items: [
          { id: "t1", name: "Personal training · 1:1", dur: "45 min", price: 40 },
          { id: "t2", name: "Small-group strength", dur: "45 min", price: 25 },
        ]},
      ],
    },
    {
      id: "laccent", name: "L'Accent Barber", cat: "barber", area: "Victoria, Mahé",
      rating: 4.9, reviews: 512, distance: "0.6 km", price: "€", tag: "Popular",
      photo: U + "1503951914875-452162b0f3f1" + q, x: 46, y: 58,
      about: "Classic hot-towel barbering in the heart of Victoria.",
      hours: [["Mon","9:00 – 18:00"],["Tue","9:00 – 18:00"],["Wed","9:00 – 18:00"],["Thu","9:00 – 19:00"],["Fri","9:00 – 19:00"],["Sat","8:00 – 17:00"],["Sun","Closed"]],
      todayIdx: 3,
      gallery: [U+"1585747860715-2ba37e788b70"+q, U+"1512864084360-7c0c4d0a0845"+q, U+"1599351431202-1e0f0137899a"+q],
      services: [
        { g: "Barber", items: [
          { id: "b1", name: "Skin fade & beard", dur: "45 min", price: 28 },
          { id: "b2", name: "Classic cut", dur: "30 min", price: 20 },
          { id: "b3", name: "Hot-towel shave", dur: "30 min", price: 22 },
        ]},
      ],
    },
    {
      id: "lumiere-nails", name: "Lumière Nails", cat: "nails", area: "Eden Island, Mahé",
      rating: 4.7, reviews: 203, distance: "2.1 km", price: "€€", tag: "Verified",
      photo: U + "1610992015732-2449b76344bc" + q, x: 72, y: 66,
      about: "Gel, BIAB and nail art by the Eden marina.",
      hours: [["Mon","9:00 – 18:00"],["Tue","9:00 – 18:00"],["Wed","9:00 – 18:00"],["Thu","9:00 – 18:00"],["Fri","9:00 – 19:00"],["Sat","9:00 – 18:00"],["Sun","10:00 – 15:00"]],
      todayIdx: 3,
      gallery: [U+"1604654894610-df63bc536371"+q, U+"1632345031435-8727f6897d53"+q, U+"1519014816548-bf5fe059798b"+q],
      services: [
        { g: "Nails", items: [
          { id: "n1", name: "Gel manicure", dur: "45 min", price: 30 },
          { id: "n2", name: "BIAB overlay", dur: "60 min", price: 42 },
          { id: "n3", name: "Pedicure spa", dur: "50 min", price: 38 },
        ]},
      ],
    },
    {
      id: "island-glow", name: "Island Glow Studio", cat: "skin", area: "Beau Vallon, Mahé",
      rating: 4.8, reviews: 176, distance: "1.4 km", price: "€€€", tag: "New",
      photo: U + "1570172619644-dfd03ed5d881" + q, x: 30, y: 30,
      about: "Results-driven facials and skin therapy.",
      hours: [["Mon","10:00 – 19:00"],["Tue","10:00 – 19:00"],["Wed","10:00 – 19:00"],["Thu","10:00 – 19:00"],["Fri","10:00 – 19:00"],["Sat","9:00 – 17:00"],["Sun","Closed"]],
      todayIdx: 3,
      gallery: [U+"1512290923902-8a9f81dc236c"+q, U+"1596755389378-c31d21fd1273"+q, U+"1607779097040-26e80aa78e66"+q],
      services: [
        { g: "Face", items: [
          { id: "f1", name: "Hydrafacial", dur: "60 min", price: 78 },
          { id: "f2", name: "LED & peel", dur: "45 min", price: 62 },
        ]},
      ],
    },
  ];

  const CLASSES = [
    { id: "c1", studio: "North Shore Fitness", studioId: "north-shore-fit", name: "Sunrise beach yoga", instructor: "with Aline", day: "Sat", time: "07:00", dur: "60 min", level: "All levels", price: 18, spots: 6, cap: 14 },
    { id: "c2", studio: "North Shore Fitness", studioId: "north-shore-fit", name: "Small-group strength", instructor: "with Denis", day: "Sat", time: "08:30", dur: "45 min", level: "Intermediate", price: 25, spots: 2, cap: 6 },
    { id: "c3", studio: "Kreol Spa", studioId: "kreol-spa", name: "Sound bath & breathwork", instructor: "with Maya", day: "Sun", time: "17:00", dur: "50 min", level: "All levels", price: 22, spots: 9, cap: 16 },
    { id: "c4", studio: "North Shore Fitness", studioId: "north-shore-fit", name: "HIIT circuit", instructor: "with Denis", day: "Mon", time: "18:00", dur: "40 min", level: "Advanced", price: 20, spots: 4, cap: 10 },
  ];

  const BOOKINGS = [
    { id: "bk1", studioId: "kreol-spa", studio: "Kreol Spa", area: "Beau Vallon, Mahé", service: "Coconut & frangipani massage", when: "Tomorrow · 14:30", price: 55, status: "Confirmed", photo: U+"1600334129128-685c5582fd35"+q, past: false },
    { id: "bk2", studioId: "north-shore-fit", studio: "North Shore Fitness", area: "Glacis, Mahé", service: "Sunrise beach yoga · class", when: "Sat · 07:00", price: 18, status: "Confirmed", photo: U+"1571902943202-507ec2618e8f"+q, past: false },
    { id: "bk3", studioId: "laccent", studio: "L'Accent Barber", area: "Victoria, Mahé", service: "Skin fade & beard", when: "12 Jun · 10:00", price: 28, status: "Completed", photo: U+"1503951914875-452162b0f3f1"+q, past: true },
    { id: "bk4", studioId: "lumiere-nails", studio: "Lumière Nails", area: "Eden Island, Mahé", service: "Gel manicure", when: "28 May · 16:30", price: 30, status: "Completed", photo: U+"1610992015732-2449b76344bc"+q, past: true },
  ];

  const REVIEWS = [
    { name: "Sara M.", when: "2 weeks ago", rating: 5, text: "The frangipani massage was unreal — left floating. Booking took ten seconds.", av: U+"1544005313-94ddf0286df2"+q },
    { name: "James O.", when: "1 month ago", rating: 5, text: "Real-time slots meant I got in same day. Spotless place, warm team.", av: U+"1500648767791-00dcc994a43e"+q },
    { name: "Nadia R.", when: "1 month ago", rating: 4, text: "Lovely treatment. Parking near Beau Vallon can be tricky at weekends.", av: U+"1534528741775-53994a69daeb"+q },
  ];

  const DAYS = [
    { d: "Today", n: "3" }, { d: "Thu", n: "4" }, { d: "Fri", n: "5" }, { d: "Sat", n: "6" },
    { d: "Sun", n: "7" }, { d: "Mon", n: "8" }, { d: "Tue", n: "9" }, { d: "Wed", n: "10" },
  ];
  const SLOTS = ["09:00","10:00","11:00","12:30","14:00","14:30","16:00","17:15","18:00","18:45","19:15","20:00"];
  const TAKEN = ["12:30","16:00","19:15"];

  const LOYALTY = [
    { studioId: "kreol-spa", studio: "Kreol Spa", photo: U+"1600334129128-685c5582fd35"+q, have: 4, need: 6, reward: "6th massage — 50% off" },
    { studioId: "laccent", studio: "L'Accent Barber", photo: U+"1503951914875-452162b0f3f1"+q, have: 9, need: 10, reward: "10th cut on the house" },
    { studioId: "lumiere-nails", studio: "Lumière Nails", photo: U+"1610992015732-2449b76344bc"+q, have: 2, need: 8, reward: "Free nail art set" },
  ];

  const STAFF = [
    { id: "aline", name: "Aline", role: "Massage therapist", rating: 4.9, av: U+"1544005313-94ddf0286df2"+q },
    { id: "denis", name: "Denis", role: "Barber", rating: 4.8, av: U+"1500648767791-00dcc994a43e"+q },
    { id: "maya", name: "Maya", role: "Nail artist", rating: 4.9, av: U+"1534528741775-53994a69daeb"+q },
    { id: "nadia", name: "Nadia", role: "Esthetician", rating: 4.7, av: U+"1531123897727-8f129e1688ce"+q },
  ];

  window.SEY_DATA = { CATEGORIES, STUDIOS, CLASSES, BOOKINGS, REVIEWS, DAYS, SLOTS, TAKEN, LOYALTY, STAFF };
})();
