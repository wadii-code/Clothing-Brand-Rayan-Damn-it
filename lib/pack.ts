import type { Product } from "./types";

// A pack bundles one hoodie and one pair of pants: its checkout asks for a size for each piece.
export const PACK_CATEGORY = "pack";

// The first `total` pack orders (cancelled ones excluded) come with a free gift. `claimedOffline`
// is how many were already handed out away from the site (DMs, in person), so the countdown reads
// total − claimedOffline − non-cancelled pack orders. Raise it when more go out off-site.
export const PACK_GIFT = { total: 50, claimedOffline: 23, value: 150 } as const;

// Gifts handed out so far, counting the off-site ones.
export const giftsTaken = (packOrders: number) => PACK_GIFT.claimedOffline + packOrders;

export const isPack = (product: Pick<Product, "category">) => product.category === PACK_CATEGORY;

// Stored in orders.size, so the control room reads both sizes at a glance.
export const packSizeLabel = (hoodieSize: string, pantsSize: string) => `Hoodie ${hoodieSize} · Pants ${pantsSize}`;
