export const site = {
  name: "DAMNIT",
  tagline: "Underground wear for the unforgiven",
  description:
    "DAMNIT — dark, underground streetwear. Embroidered hoodies and baggy denim. Order online, pay cash on delivery.",
  drop: "DROP 01",
  season: "SS—26",
  marqueePrimary: ["DAMN IT", "CASH ON DELIVERY", "DROP 01", "NO CARD NEEDED"],
  marqueeSecondary: ["WORN LIKE A WARNING", "STITCHED IN RED", "BORN IN THE DARK"],
  checkoutNote:
    "You pay in cash when the package reaches your door. We call you to confirm before shipping.",
  // Empty = hidden in the footer.
  social: {
    instagram: "",
    tiktok: "",
  },
} as const;

export const lookbook = [
  { src: "/products/solar-sigil-hoodie-front.jpg", look: "LOOK 01", caption: "Solar Sigil Hoodie — Front" },
  { src: "/products/solar-sigil-hoodie-side.jpg", look: "LOOK 02", caption: "Solar Sigil Hoodie — Profile" },
  { src: "/products/solar-sigil-hoodie-back.jpg", look: "LOOK 03", caption: "Solar Sigil Hoodie — Back" },
  { src: "/products/northstar-baggy-jeans-front.jpg", look: "LOOK 04", caption: "Northstar Baggy Jeans — Front" },
  { src: "/products/northstar-baggy-jeans-side.jpg", look: "LOOK 05", caption: "Northstar Baggy Jeans — Profile" },
  { src: "/products/northstar-baggy-jeans-back.jpg", look: "LOOK 06", caption: "Northstar Baggy Jeans — Back" },
] as const;

export const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "Salé", "Témara", "Mohammédia", "El Jadida", "Safi",
  "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid", "Essaouira", "Taza",
  "Larache", "Ksar El Kébir", "Khémisset", "Guelmim", "Errachidia", "Ouarzazate",
  "Al Hoceïma", "Ifrane", "Laâyoune", "Dakhla",
];
