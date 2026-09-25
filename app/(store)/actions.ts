"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { orderRef } from "@/lib/format";
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
  if (text(formData, "website")) return { status: "success", orderRef: "RECEIVED", phone: "" };

  const parsed = orderSchema.safeParse({
    productId: text(formData, "productId"),
    size: text(formData, "size"),
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
    .select("id, name, price, sizes")
    .eq("id", order.productId)
    .maybeSingle();

  if (productError || !product) {
    return { status: "error", message: "This piece is no longer available.", fieldErrors: {}, values };
  }

  const sizes: string[] = product.sizes ?? [];
  if (sizes.length > 0 && !sizes.includes(order.size)) {
    return { status: "error", message: "Pick your size.", fieldErrors: { size: "Pick a size" }, values };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("orders")
    .insert({
      product_id: product.id,
      product_name: product.name,
      size: sizes.length > 0 ? order.size : null,
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
    console.error("[damnit] order insert failed", insertError);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  return { status: "success", orderRef: orderRef(inserted.id), phone: order.phone };
}
