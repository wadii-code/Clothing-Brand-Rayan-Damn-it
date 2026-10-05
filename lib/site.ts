export const site = {
  name: "SKIRO",
  tagline: "Underground wear for the unforgiven",
  description:
    "SKIRO — dark, underground streetwear from Morocco. Embroidered hoodies and baggy denim. Order online, free delivery, pay cash on delivery.",
  drop: "DROP 01",
  season: "SS—26",
  marqueePrimary: ["SKIRO", "CASH ON DELIVERY", "FREE DELIVERY", "DROP 01", "NO CARD NEEDED"],
  marqueeSecondary: ["WORN LIKE A WARNING", "STITCHED IN RED", "BORN IN THE DARK"],
  checkoutNote:
    "You pay in cash when the package reaches your door. We call you to confirm before shipping.",
  // Empty = hidden in the footer.
  social: {
    instagram: "https://www.instagram.com/skiro_store925/",
    tiktok: "",
  },
} as const;

export const lookbook = [
  { src: "/products/full-fit-pack-front.jpg", look: "LOOK 01", caption: "Red Pack — Front" },
  { src: "/products/full-fit-pack-back.jpg", look: "LOOK 02", caption: "Red Pack — Back" },
  { src: "/products/solar-sigil-hoodie-front.jpg", look: "LOOK 03", caption: "Red Hoodie — Front" },
  { src: "/products/solar-sigil-hoodie-side.jpg", look: "LOOK 04", caption: "Red Hoodie — Profile" },
  { src: "/products/solar-sigil-hoodie-back.jpg", look: "LOOK 05", caption: "Red Hoodie — Back" },
  { src: "/products/northstar-baggy-jeans-front.jpg", look: "LOOK 06", caption: "Red Pants — Front" },
  { src: "/products/northstar-baggy-jeans-side.jpg", look: "LOOK 07", caption: "Red Pants — Profile" },
  { src: "/products/northstar-baggy-jeans-back.jpg", look: "LOOK 08", caption: "Red Pants — Back" },
] as const;

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Safi",
  "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid", "Essaouira", "Taza",
  "Larache", "Ksar El Kébir", "Khémisset", "Guelmim", "Errachidia", "Ouarzazate",
  "Al Hoceïma", "Ifrane", "Laâyoune", "Dakhla",
];
