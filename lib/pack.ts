import type { Product } from "./types";

// A pack bundles one hoodie and one pair of pants: its checkout asks for a size for each piece.
export const PACK_CATEGORY = "pack";

// The first `total` pack orders (cancelled ones excluded) come with a free gift.
export const PACK_GIFT = { total: 50, value: 150 } as const;

export const isPack = (product: Pick<Product, "category">) => product.category === PACK_CATEGORY;

// Stored in orders.size, so the control room reads both sizes at a glance.
export const packSizeLabel = (hoodieSize: string, pantsSize: string) => `Hoodie ${hoodieSize} · Pants ${pantsSize}`;
