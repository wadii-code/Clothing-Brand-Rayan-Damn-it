import type { Product } from "./types";

// Fallback when Supabase env vars are missing. Mirrors the seed in supabase/schema.sql.
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "8b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
    slug: "red-pack",
    name: "Red Pack",
    description:
      "The full fit in one box: the Red Hoodie and the Red Pants. Pick a size for each piece. 61 DH less than buying them apart.",
    price: 499,
    mainImage: "/products/full-fit-pack-front.jpg",
    hoverImage: "/products/full-fit-pack-back.jpg",
    category: "pack",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "6f1c2d3e-4b5a-4c6d-8e7f-9a0b1c2d3e4f",
    slug: "red-hoodie",
    name: "Red Hoodie",
    description:
      "Heavyweight black fleece hoodie. Blood-red Solar Sigil embroidered across the back, northstar chain running down both sleeves. Oversized, dropped shoulders.",
    price: 280,
    mainImage: "/products/solar-sigil-hoodie-front.jpg",
    hoverImage: "/products/solar-sigil-hoodie-back.jpg",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "7a2b3c4d-5e6f-4a7b-9c8d-0e1f2a3b4c5d",
    slug: "red-pants",
    name: "Red Pants",
    description:
      "Washed black baggy denim with a chain of red northstars embroidered down every leg. Wide, stacked fit that breaks over the sneaker.",
    price: 280,
    mainImage: "/products/northstar-baggy-jeans-front.jpg",
    hoverImage: "/products/northstar-baggy-jeans-back.jpg",
    category: "pants",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];
