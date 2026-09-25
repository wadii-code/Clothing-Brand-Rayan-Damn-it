export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  mainImage: string;
  hoverImage: string | null;
  category: string;
  sizes: string[];
};

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  ref: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  size: string | null;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
};
