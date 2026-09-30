import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getSupabaseAdmin } from "./supabase/server";
import { DEMO_PRODUCTS } from "./demo-products";
import type { Product } from "./types";

const PRODUCT_COLUMNS = "id, slug, name, description, price, main_image, hover_image, category, sizes";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | string;
  main_image: string;
  hover_image: string | null;
  category: string;
  sizes: string[] | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    mainImage: row.main_image,
    hoverImage: row.hover_image,
    category: row.category,
    sizes: row.sizes ?? [],
  };
}

let warned = false;
function warnDemoMode() {
  if (warned) return;
  warned = true;
  console.warn("[skiro] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — serving demo products.");
}

// Shared by every page and request for 60s (the pages' ISR window), so a burst of regenerations
// costs a single database round trip. Refresh on demand with revalidateTag(PRODUCTS_TAG, "max").
export const PRODUCTS_TAG = "products";

const fetchProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      warnDemoMode();
      return DEMO_PRODUCTS;
    }

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to load products: ${error.message}`);
    return (data as ProductRow[]).map(toProduct);
  },
  [PRODUCTS_TAG],
  { revalidate: 60, tags: [PRODUCTS_TAG] },
);

export const getProducts = cache(() => fetchProducts());

// Product pages need the full catalog anyway (related pieces), so look the slug up in it
// instead of paying for a second query.
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
