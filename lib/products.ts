import "server-only";
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
  console.warn("[damnit] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — serving demo products.");
}

export const getProducts = cache(async (): Promise<Product[]> => {
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
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    warnDemoMode();
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product "${slug}": ${error.message}`);
  return data ? toProduct(data as ProductRow) : null;
});
