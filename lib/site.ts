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

// Grouped pack → hoodie → pants, like the shop. The pack/hoodie/pants main + hover pictures
// (pic4/pic3, pic6/pic11, pic5/pic1) are the ones the products table points at.
export const lookbook = [
  { src: "/products/pic4.png", look: "LOOK 01", caption: "Red Pack — Front" },
  { src: "/products/pic3.png", look: "LOOK 02", caption: "Red Pack — Profile" },
  { src: "/products/pic9.png", look: "LOOK 03", caption: "Red Pack — Duo" },
  { src: "/products/pic10.png", look: "LOOK 04", caption: "Red Pack — Low Angle" },
  { src: HIBA.seated, look: "LOOK 05", caption: "Red Pack — Seated" },
  { src: "/products/pic6.png", look: "LOOK 06", caption: "Red Hoodie — Front" },
  { src: HIBA.lakeside, look: "LOOK 07", caption: "Red Hoodie — Lakeside" },
  { src: "/products/pic7.png", look: "LOOK 08", caption: "Red Hoodie — Close Up" },
  { src: "/products/pic12.png", look: "LOOK 09", caption: "Red Hoodie — Three-Quarter" },
  { src: "/products/pic2.png", look: "LOOK 10", caption: "Red Hoodie — Duo" },
  { src: "/products/pic8.png", look: "LOOK 11", caption: "Red Hoodie — Low Angle" },
  { src: HIBA.sky, look: "LOOK 12", caption: "Red Hoodie — Blue Sky" },
  { src: "/products/pic11.png", look: "LOOK 13", caption: "Red Hoodie — Back" },
  { src: "/products/pic5.png", look: "LOOK 14", caption: "Red Pants — Detail" },
  { src: "/products/pic1.png", look: "LOOK 15", caption: "Red Pants — Profile" },
] as const;

// Extra pictures appended to a product page's gallery, by product slug. Code-side on purpose: the
// products table only holds a main and a hover picture. Pictures already used as the main/hover one
// are dropped from the gallery, so this list stays valid before and after the table is updated.
export const productExtraImages: Record<string, readonly string[]> = {
  "red-pack": [HIBA.seated, "/products/pic3.png", HIBA.lakeside],
  "red-hoodie": [HIBA.lakeside, HIBA.sky],
  "red-pants": ["/products/pic3.png", "/products/pic1.png", HIBA.seated],
};

// The shop's "on model" strip, pack → hoodie like the grid: each photo links to the piece it shows.
export const modelShots = [
  { src: HIBA.seated, slug: "red-pack", caption: "Red Pack — Seated" },
  { src: HIBA.lakeside, slug: "red-hoodie", caption: "Red Hoodie — Lakeside" },
  { src: HIBA.sky, slug: "red-hoodie", caption: "Red Hoodie — Blue Sky" },
] as const;

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Safi",
  "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid", "Essaouira", "Taza",
  "Larache", "Ksar El Kébir", "Khémisset", "Guelmim", "Errachidia", "Ouarzazate",
  "Al Hoceïma", "Ifrane", "Laâyoune", "Dakhla",
];
