"use server";

import { updateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { orderRef } from "@/lib/format";
import { PACK_GIFT, isPack, packSizeLabel } from "@/lib/pack";
import { PACK_GIFT_TAG, countPackOrders } from "@/lib/pack-gift";
import {
  firstFieldErrors,
  orderSchema,
  type OrderFormState,
  type OrderTextValues,
} from "@/lib/order-schema";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

export async function placeOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const values: OrderTextValues = {
    customerName: text(formData, "customerName"),
    phone: text(formData, "phone"),
    city: text(formData, "city"),
    address: text(formData, "address"),
  };

  // Honeypot filled → fake success so bots don't retry.
  if (text(formData, "website")) return { status: "success", orderRef: "RECEIVED", phone: "", gift: false };

  const parsed = orderSchema.safeParse({
    productId: text(formData, "productId"),
    size: text(formData, "size"),
    pantsSize: text(formData, "pantsSize"),
    quantity: text(formData, "quantity"),
    ...values,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: firstFieldErrors(parsed.error),
      values,
    };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      status: "error",
      message: "The shop isn't connected to its database yet. Try again later.",
      fieldErrors: {},
      values,
    };
  }

  const order = parsed.data;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, price, sizes, category")
    .eq("id", order.productId)
    .maybeSingle();

  if (productError || !product) {
    return { status: "error", message: "This piece is no longer available.", fieldErrors: {}, values };
  }

  const sizes: string[] = product.sizes ?? [];
  const pack = isPack(product);
  if (sizes.length > 0 && !sizes.includes(order.size)) {
    return { status: "error", message: "Pick your size.", fieldErrors: { size: "Pick a size" }, values };
  }
  if (pack && sizes.length > 0 && !sizes.includes(order.pantsSize ?? "")) {
    return { status: "error", message: "Pick your size.", fieldErrors: { pantsSize: "Pick a size" }, values };
  }

  // Counted fresh, not from the cached countdown. Two orders landing on the last gift at the
  // same instant could both get it; the confirmation call settles that rare case.
  let giftNumber = 0;
  if (pack) {
    try {
      const taken = await countPackOrders(supabase, product.id);
      if (taken < PACK_GIFT.total) giftNumber = taken + 1;
    } catch (error) {
      console.error("[skiro] gift count failed, order kept without gift", error);
    }
  }
  const gift = giftNumber > 0;

  const size = sizes.length === 0 ? null : pack ? packSizeLabel(order.size, order.pantsSize ?? "") : order.size;

  const { data: inserted, error: insertError } = await supabase
    .from("orders")
    .insert({
      product_id: product.id,
      // The gift is promised at checkout, so it is snapshotted here for the control room.
      product_name: gift
        ? `${product.name} + Free gift (${String(giftNumber).padStart(2, "0")}/${PACK_GIFT.total})`
        : product.name,
      size,
      quantity: order.quantity,
      total_price: Number(product.price) * order.quantity,
      customer_name: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[skiro] order insert failed", insertError);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  if (pack) updateTag(PACK_GIFT_TAG);

  return { status: "success", orderRef: orderRef(inserted.id), phone: order.phone, gift };
}
