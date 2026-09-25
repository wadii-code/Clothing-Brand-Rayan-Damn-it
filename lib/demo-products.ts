import type { Product } from "./types";

// Fallback when Supabase env vars are missing. Mirrors the seed in supabase/schema.sql.
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "6f1c2d3e-4b5a-4c6d-8e7f-9a0b1c2d3e4f",
    slug: "solar-sigil-hoodie",
    name: "Solar Sigil Hoodie",
    description:
      "Heavyweight black fleece hoodie. Blood-red Solar Sigil embroidered across the back, northstar chain running down both sleeves. Oversized, dropped shoulders.",
    price: 450,
    mainImage: "/products/solar-sigil-hoodie-front.jpg",
    hoverImage: "/products/solar-sigil-hoodie-back.jpg",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "7a2b3c4d-5e6f-4a7b-9c8d-0e1f2a3b4c5d",
    slug: "northstar-baggy-jeans",
    name: "Northstar Baggy Jeans",
    description:
      "Washed black baggy denim with a chain of red northstars embroidered down every leg. Wide, stacked fit that breaks over the sneaker.",
    price: 420,
    mainImage: "/products/northstar-baggy-jeans-front.jpg",
    hoverImage: "/products/northstar-baggy-jeans-back.jpg",
    category: "pants",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];
