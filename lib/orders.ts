import "server-only";
import { getSupabaseAdmin } from "./supabase/server";
import { isAdmin } from "./admin-auth";
import { orderRef } from "./format";
import { ORDER_STATUSES, type Order, type OrderStatus } from "./types";

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  quantity: number;
  total_price: number | string;
  status: string;
  product: { main_image: string } | null;
};

const ORDER_LIMIT = 1000;

function toOrder(row: OrderRow): Order {
  const status = (ORDER_STATUSES as readonly string[]).includes(row.status)
    ? (row.status as OrderStatus)
    : "pending";
  return {
    id: row.id,
    ref: orderRef(row.id),
    createdAt: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    city: row.city,
    address: row.address,
    productId: row.product_id,
    productName: row.product_name,
    productImage: row.product?.main_image ?? null,
    size: row.size,
    quantity: row.quantity,
    totalPrice: Number(row.total_price),
    status,
  };
}

export async function getOrders(): Promise<{ orders: Order[]; error: string | null }> {
  // Checked here too, not just in the page: this returns customer PII.
  if (!(await isAdmin())) return { orders: [], error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      orders: [],
      error: "Supabase is not connected. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart the server.",
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer_name, phone, city, address, product_id, product_name, size, quantity, total_price, status, product:products(main_image)",
    )
    .order("created_at", { ascending: false })
    .limit(ORDER_LIMIT);

  if (error) {
    console.error("[damnit] failed to load orders", error);
    return { orders: [], error: `Could not load orders: ${error.message}` };
  }

  return { orders: (data as unknown as OrderRow[]).map(toOrder), error: null };
}
