import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { PACK_GIFT, isPack } from "./pack";
import { getProducts } from "./products";
import { getSupabaseAdmin } from "./supabase/server";

// Expired by placeOrder right after a pack order, so the countdown never lags behind a sale.
export const PACK_GIFT_TAG = "pack-gift";

// Cancelled orders hand their gift back.
export async function countPackOrders(supabase: SupabaseClient, packId: string): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("product_id", packId)
    .neq("status", "cancelled");
  if (error) throw new Error(`Failed to count pack orders: ${error.message}`);
  return count ?? 0;
}

// Every visitor polls this, so one count query per 15s serves them all.
const fetchGiftsLeft = unstable_cache(
  async (packId: string): Promise<number> => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return PACK_GIFT.total;
    return Math.max(0, PACK_GIFT.total - (await countPackOrders(supabase, packId)));
  },
  [PACK_GIFT_TAG],
  { revalidate: 15, tags: [PACK_GIFT_TAG] },
);

// null = no pack on sale, or the count failed: the notice hides rather than taking the page down.
export async function getGiftsLeft(): Promise<number | null> {
  try {
    const pack = (await getProducts()).find(isPack);
    return pack ? await fetchGiftsLeft(pack.id) : null;
  } catch (error) {
    console.error("[skiro] failed to load pack gifts", error);
    return null;
  }
}
