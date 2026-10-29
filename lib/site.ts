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

// On-model photos (public/products/hiba1–3).
const HIBA = {
  lakeside: "/products/hiba1.jpeg",
  seated: "/products/hiba2.jpeg",
  sky: "/products/hiba3.jpeg",
} as const;

// Web-sized copies of the full-resolution shoot (originals live in "real images/", kept out of the
// repo). The landscape ray shots were cropped to 3:4 around him, like every photo slot on the site.
const SHOOT = {
  duoClose: "/products/both1.jpg",
  duoSeated: "/products/both2.jpg",
  sleeve: "/products/ray1.jpg",
  masked: "/products/ray2.jpg",
  fullLook: "/products/ray3.jpg",
} as const;

// Grouped pack → hoodie → pants, like the shop. The pack/hoodie/pants main + hover pictures
// (hiba2/pic4, ray2/pic6, pic5/pic3) are the ones the products table points at.
// The "LOOK 01…" labels are numbered from the order here.
export const lookbook = [
  { src: "/products/pic4.png", caption: "Red Pack — Front" },
  { src: "/products/pic3.png", caption: "Red Pack — Profile" },
  { src: "/products/pic9.png", caption: "Red Pack — Duo" },
  { src: "/products/pic10.png", caption: "Red Pack — Low Angle" },
  { src: HIBA.seated, caption: "Red Pack — Seated" },
  { src: SHOOT.duoClose, caption: "Red Pack — Close Duo" },
  { src: SHOOT.duoSeated, caption: "Red Pack — Seated Duo" },
  { src: "/products/pic6.png", caption: "Red Hoodie — Front" },
  { src: HIBA.lakeside, caption: "Red Hoodie — Lakeside" },
  { src: "/products/pic7.png", caption: "Red Hoodie — Close Up" },
  { src: "/products/pic12.png", caption: "Red Hoodie — Three-Quarter" },
  { src: "/products/pic2.png", caption: "Red Hoodie — Duo" },
  { src: "/products/pic8.png", caption: "Red Hoodie — Low Angle" },
  { src: HIBA.sky, caption: "Red Hoodie — Blue Sky" },
  { src: SHOOT.sleeve, caption: "Red Hoodie — Sleeve" },
  { src: SHOOT.masked, caption: "Red Hoodie — Masked" },
  { src: "/products/pic11.png", caption: "Red Hoodie — Back" },
  { src: "/products/pic5.png", caption: "Red Pants — Detail" },
  { src: "/products/pic1.png", caption: "Red Pants — Profile" },
  { src: SHOOT.fullLook, caption: "Red Pants — Full Look" },
] as const;

// Extra pictures appended to a product page's gallery, by product slug. Code-side on purpose: the
// products table only holds a main and a hover picture. Pictures already used as the main/hover one
// are dropped from the gallery, so this list stays valid before and after the table is updated.
export const productExtraImages: Record<string, readonly string[]> = {
  "red-pack": [HIBA.seated, "/products/pic3.png", SHOOT.duoSeated, SHOOT.duoClose, HIBA.lakeside],
  "red-hoodie": [SHOOT.masked, "/products/pic11.png", HIBA.lakeside, SHOOT.sleeve, HIBA.sky],
  "red-pants": ["/products/pic3.png", SHOOT.fullLook, "/products/pic1.png", HIBA.seated],
};

// The shop's "on model" strip, pack → hoodie → pants like the grid: each photo links to the piece it shows.
export const modelShots = [
  { src: HIBA.seated, slug: "red-pack", caption: "Red Pack — Seated" },
  { src: SHOOT.duoSeated, slug: "red-pack", caption: "Red Pack — Seated Duo" },
  { src: HIBA.lakeside, slug: "red-hoodie", caption: "Red Hoodie — Lakeside" },
  { src: SHOOT.masked, slug: "red-hoodie", caption: "Red Hoodie — Masked" },
  { src: HIBA.sky, slug: "red-hoodie", caption: "Red Hoodie — Blue Sky" },
  { src: SHOOT.fullLook, slug: "red-pants", caption: "Red Pants — Full Look" },
] as const;

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Safi",
  "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid", "Essaouira", "Taza",
  "Larache", "Ksar El Kébir", "Khémisset", "Guelmim", "Errachidia", "Ouarzazate",
  "Al Hoceïma", "Ifrane", "Laâyoune", "Dakhla",
];
