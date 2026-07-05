// Category presets — the "content engine" that turns a bare prospect (name +
// city + category) into a finished-looking page. Photos, tagline, bio, a sensible
// menu and opening hours per category, all overridable by the caller.
const U = "https://images.unsplash.com/photo-";
const q = "?auto=format&fit=crop&w=1400&q=75";

// day_of_week 0..6 = Mon..Sun; minutes from midnight.
const H_STD = [[0, 540, 1080], [1, 540, 1080], [2, 540, 1080], [3, 540, 1140], [4, 540, 1140], [5, 540, 1020]];

export const CATEGORY_PRESETS = {
  "Barber": {
    tagline: "Sharp cuts, hot-towel shaves and proper grooming.",
    bio: "A neighbourhood barbershop with old-school craft and a modern edge — skin fades, beard sculpting and a straight-razor shave that leaves you feeling brand new.",
    photos: ["1503951914875-452162b0f3f1", "1585747860715-2ba37e788b70", "1599351431202-1e0f0137899a", "1512864084360-7c0c4d0a0845"],
    services: [["Skin fade & beard", 45, 28], ["Classic cut", 30, 20], ["Hot-towel straight-razor shave", 30, 22], ["Beard trim & line-up", 20, 15], ["Father & son", 60, 38]],
  },
  "Hair": {
    tagline: "Cut, colour and care by hands that listen.",
    bio: "A calm salon for cuts, balayage and treatments — leave with hair that feels like you, only better.",
    photos: ["1560066984-138dadb4c035", "1522337660859-02fbefca4702", "1521590832167-7bcbfaa6381f", "1519419691348-3b3433c4c20e"],
    services: [["Cut & blow-dry", 60, 40], ["Balayage", 150, 95], ["Full colour", 120, 70], ["Gloss & treatment", 45, 35], ["Blow-dry", 30, 25]],
  },
  "Nails": {
    tagline: "Gel, BIAB and nail art with a steady hand.",
    bio: "Immaculate manicures and pedicures — from a clean classic to full nail art — in a bright, relaxed studio.",
    photos: ["1604654894610-df63bc536371", "1632345031435-8727f6897d53", "1519014816548-bf5fe059798b", "1607779097040-26e80aa78e66"],
    services: [["Gel manicure", 45, 30], ["BIAB overlay", 60, 42], ["Pedicure spa", 50, 38], ["Nail art (per hand)", 30, 20], ["Soak-off & tidy", 20, 15]],
  },
  "Spa & massage": {
    tagline: "A quiet island ritual — warm oils and slow hands.",
    bio: "Massage and body rituals to melt the week away — coconut and frangipani oils, hot stones and deep tissue by therapists who take their time.",
    photos: ["1600334129128-685c5582fd35", "1544161515-4ab6ce6db874", "1519823551278-64ac92734fb1", "1540555700478-4be289fbecef"],
    services: [["Coconut & frangipani massage", 60, 55], ["Hot stone therapy", 75, 65], ["Deep tissue", 60, 58], ["Aromatherapy full body", 90, 70], ["Back, neck & shoulders", 30, 32]],
  },
  "Skin & facial": {
    tagline: "Results-driven facials and calm skin therapy.",
    bio: "Tailored facials, peels and LED — honest skincare that leaves you glowing, never rushed.",
    photos: ["1570172619644-dfd03ed5d881", "1512290923902-8a9f81dc236c", "1596755389378-c31d21fd1273", "1607779097040-26e80aa78e66"],
    services: [["Signature facial", 60, 55], ["Hydrafacial", 60, 78], ["LED & peel", 45, 62], ["Express glow", 30, 32], ["Back facial", 45, 48]],
  },
  "Brows & lashes": {
    tagline: "Brows framed, lashes lifted, done properly.",
    bio: "Brow shaping, lamination and lash lifts & extensions — subtle, natural and made for you.",
    photos: ["1583001931096-959e9a1a6223", "1596704017254-9b121068fb31", "1512496015851-a90fb38ba796", "1487412947147-5cebf100ffc2"],
    services: [["Brow shape & tint", 30, 22], ["Brow lamination", 45, 40], ["Lash lift & tint", 45, 42], ["Classic lash set", 90, 65], ["Lash infill", 60, 40]],
  },
  "Makeup": {
    tagline: "Makeup for the day you'll remember.",
    bio: "Bridal, event and lesson makeup — flawless, long-wearing and unmistakably you.",
    photos: ["1487412947147-5cebf100ffc2", "1522337360788-8b13dee7a37e", "1596462502278-27bfdc403348", "1512496015851-a90fb38ba796"],
    services: [["Event makeup", 60, 55], ["Bridal makeup", 90, 110], ["Makeup lesson", 90, 75], ["Lashes add-on", 15, 12], ["Trial run", 60, 45]],
  },
  "Fitness & yoga": {
    tagline: "Move, breathe, feel strong — by the sea.",
    bio: "Small-group training, sunrise beach yoga and personal sessions to build strength and calm.",
    photos: ["1571902943202-507ec2618e8f", "1518611012118-696072aa579a", "1534438327276-14e5300c3a48", "1506126613408-eca07ce68773"],
    services: [["Personal training · 1:1", 45, 40], ["Small-group strength", 45, 25], ["Sunrise beach yoga", 60, 18], ["HIIT circuit", 40, 20], ["Mobility & stretch", 45, 22]],
  },
};

const DEFAULT_PRESET = {
  tagline: "Book your next appointment in seconds.",
  bio: "A local studio on sey.la — real-time booking, no phone tag. Claim this page to make it yours.",
  photos: ["1521590832167-7bcbfaa6381f", "1560066984-138dadb4c035", "1600334129128-685c5582fd35", "1519014816548-bf5fe059798b"],
  services: [["Signature service", 60, 45], ["Express service", 30, 25], ["Premium service", 90, 70]],
};

export function presetFor(category) {
  const p = CATEGORY_PRESETS[category] || DEFAULT_PRESET;
  return {
    tagline: p.tagline,
    bio: p.bio,
    photos: p.photos.map((id) => U + id + q),
    services: p.services.map(([name, duration_min, price_eur]) => ({ name, duration_min, price_eur })),
    hours: H_STD.map(([day_of_week, open_min, close_min]) => ({ day_of_week, open_min, close_min })),
  };
}

export const PROSPECT_CATEGORIES = Object.keys(CATEGORY_PRESETS);
