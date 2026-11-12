export const site = {
  name: "SKIRO",
  tagline: "Underground wear for the unforgiven",
  description:
    "SKIRO , dark, underground streetwear from Morocco. Embroidered hoodies and baggy denim. Order online, free delivery, pay cash on delivery.",
  drop: "DROP 01",
  season: "SS—26",
  marqueePrimary: ["SKIRO", "CASH ON DELIVERY", "FREE DELIVERY", "DROP 01", "NO CARD NEEDED"],
  marqueeSecondary: ["WORN LIKE A WARNING", "STITCHED IN RED", "BORN IN THE DARK"],
  checkoutNote:
    "You pay in cash when the package reaches your door. We call you to confirm before shipping.",
  // Empty = hidden in the footer.
  social: {
    instagram: "https://www.instagram.com/skiro.925/",
    tiktok: "https://www.tiktok.com/@skiro_925",
  },
} as const;

// The shoot, filed by the piece each photo sells (public/products/{pack,hoodie,pants}/) plus the
// mixed frames at the folder root. Every slot on the site is portrait, so landscape frames are
// cropped to their centre unless a section opts into a wide card.
const PACK = {
  mosaic: "/products/pack/pack1.jpeg", // duo against the mosaic face
  tyres: "/products/pack/pack2.jpeg", // seated on the painted tyres, dusk
  signs: "/products/pack/pack3.jpeg", // landscape: duo between the yellow plate boards
  curb: "/products/pack/pack4.jpeg", // pants chain + sleeve, bag in hand
  street: "/products/pack/pack5.jpeg", // walking the street, sunglasses
  flat: "/products/pack/pack6.jpeg", // the full set laid flat
  corner: "/products/pack/pack7.jpeg", // masked duo in the dark doorway
  river: "/products/pack/pack8.jpeg", // riverside, blue sky
} as const;

const HOODIE = {
  lakeside: "/products/hoodie/hoodie0.jpeg",
  pole: "/products/hoodie/hoodie1.jpeg", // hand to face under the wires, dusk
  masked: "/products/hoodie/hoodie2.jpeg", // hood up, face covered, city behind
  sleeves: "/products/hoodie/hoodie3.jpeg", // both sleeve chains, no face
  bike: "/products/hoodie/hoodie4.jpeg", // arms crossed over the motorbike
  garden: "/products/hoodie/hoodie5.jpeg", // night garden, flash
  crosswalk: "/products/hoodie/hoodie6.jpeg", // duo on the street, hoodie in front
  graffiti: "/products/hoodie/hoodie7.jpeg", // yellow graffiti wall
} as const;

const PANTS = {
  stride: "/products/pants/pants0.jpeg", // chain down the leg, mid-step
  side: "/products/pants/pants1.jpeg",
  stacked: "/products/pants/pants2.jpeg", // profile, stacked over the sneaker
  flat: "/products/pants/pants3.jpeg", // pants laid flat
  flatSet: "/products/pants/pants4.jpeg", // pants + hoodie laid flat
  doorway: "/products/pants/pants5.jpeg", // yellow shutter, white tee
  detail: "/products/pants/pants6.jpeg", // embroidery close-up, flat
} as const;

const SHOOT = {
  duoClose: "/products/both1.jpg",
  duoTyres: "/products/both2.jpg",
  sky: "/products/hiba3.jpeg",
  back: "/products/pic11.png",
  wires: "/products/pic12.png",
  nightGarden: "/products/pic7.png",
  lamp: "/products/pic8.png",
  duoSeated: "/products/pic9.png",
  sleeve: "/products/ray1.jpg",
  masked: "/products/ray2.jpg",
  fullLook: "/products/ray3.jpg",
} as const;

// The main + hover picture of each piece, as the products table points at them
// (supabase/update-products.sql). Kept here so the fallback catalog and the SQL agree.
export const productImages = {
  "red-pack": { main: PACK.mosaic, hover: PACK.flat },
  "red-hoodie": { main: HOODIE.masked, hover: HOODIE.sleeves },
  "red-pants": { main: PANTS.stride, hover: PANTS.detail },
} as const;

// The home carousel shows a different frame of each piece than its card, with a smaller inset
// shot, so the same three products read as new when the slider comes round.
export const featuredShots: Record<string, { main: string; inset: string }> = {
  "red-pack": { main: PACK.corner, inset: PACK.street },
  "red-hoodie": { main: HOODIE.bike, inset: SHOOT.sleeve },
  "red-pants": { main: PANTS.doorway, inset: PANTS.flat },
};

type Look = { src: string; caption: string; wide?: boolean };

// Deliberately shuffled: pack, hoodie and pants take turns, day frames next to night ones, a duo
// after a solo, one flat lay every few looks. A `wide` look is a landscape card that breaks the
// rhythm of the horizontal strip. The "LOOK 01…" labels are numbered from the order here.
export const lookbook: readonly Look[] = [
  { src: HOODIE.lakeside, caption: "Red Hoodie — Lakeside" },
  { src: PACK.street, caption: "Red Pack — Street" },
  { src: PANTS.side, caption: "Red Pants — Profile" },
  { src: SHOOT.duoTyres, caption: "Red Pack — Tyres" },
  { src: HOODIE.graffiti, caption: "Red Hoodie — Graffiti" },
  { src: PACK.signs, caption: "Red Pack — Plates", wide: true },
  { src: PANTS.flat, caption: "Red Pants — Flat Lay" },
  { src: HOODIE.garden, caption: "Red Hoodie — Night Garden" },
  { src: PACK.curb, caption: "Red Pack — Curbside" },
  { src: SHOOT.sky, caption: "Red Hoodie — Blue Sky" },
  { src: PANTS.stacked, caption: "Red Pants — Stacked" },
  { src: PACK.river, caption: "Red Pack — Riverside" },
  { src: HOODIE.pole, caption: "Red Hoodie — Dusk" },
  { src: SHOOT.lamp, caption: "Red Pack — Lamp" },
  { src: PANTS.flatSet, caption: "Red Pants — Full Set" },
  { src: SHOOT.back, caption: "Red Hoodie — Back" },
  { src: SHOOT.duoClose, caption: "Red Pack — Close Duo" },
  { src: SHOOT.fullLook, caption: "Red Pants — Full Look" },
];

// Extra pictures appended to a product page's gallery, by product slug. Code-side on purpose: the
// products table only holds a main and a hover picture. Pictures already used as the main/hover one
// are dropped from the gallery, so this list stays valid before and after the table is updated.
export const productExtraImages: Record<string, readonly string[]> = {
  "red-pack": [PACK.corner, PACK.street, PACK.signs, SHOOT.duoTyres, PACK.river, PACK.curb],
  "red-hoodie": [HOODIE.graffiti, HOODIE.lakeside, HOODIE.bike, SHOOT.sleeve, HOODIE.garden, SHOOT.back],
  "red-pants": [PANTS.side, PANTS.doorway, PANTS.flat, PANTS.stacked, SHOOT.fullLook, PANTS.flatSet],
};

// The shop's "on model" strip, pack → hoodie → pants like the grid: each photo links to the piece it shows.
// None of these is a card picture, so the strip never repeats the grid above it.
export const modelShots = [
  { src: PACK.corner, slug: "red-pack", caption: "Red Pack — Doorway" },
  { src: PACK.river, slug: "red-pack", caption: "Red Pack — Riverside" },
  { src: HOODIE.bike, slug: "red-hoodie", caption: "Red Hoodie — Motorbike" },
  { src: SHOOT.masked, slug: "red-hoodie", caption: "Red Hoodie — Masked" },
  { src: PANTS.doorway, slug: "red-pants", caption: "Red Pants — Doorway" },
  { src: SHOOT.fullLook, slug: "red-pants", caption: "Red Pants — Full Look" },
] as const;

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Safi",
  "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid", "Essaouira", "Taza",
  "Larache", "Ksar El Kébir", "Khémisset", "Guelmim", "Errachidia", "Ouarzazate",
  "Al Hoceïma", "Ifrane", "Laâyoune", "Dakhla",
];
