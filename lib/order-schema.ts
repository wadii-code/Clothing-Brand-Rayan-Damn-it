import { z } from "zod";

// Moroccan numbers: 05/06/07… or +212 / 00212.
const MOROCCAN_PHONE = /^(?:\+212|00212|0)([5-7]\d{8})$/;

const stripPhone = (raw: string) => raw.replace(/[\s.\-()]/g, "");

export const orderSchema = z.object({
  productId: z.uuid("Unknown product"),
  size: z.string().trim().max(10),
  quantity: z.coerce.number().int().min(1, "Min 1").max(10, "Max 10 per order"),
  customerName: z
    .string()
    .trim()
    .min(3, "Enter your full name")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .transform(stripPhone)
    .pipe(z.string().regex(MOROCCAN_PHONE, "Enter a valid Moroccan number (06 / 07 …)"))
    .transform((phone) => `0${MOROCCAN_PHONE.exec(phone)![1]}`),
  city: z.string().trim().min(2, "Enter your city").max(60, "City is too long"),
  address: z
    .string()
    .trim()
    .min(8, "Add street, building and apartment")
    .max(300, "Address is too long"),
});

export type OrderInput = z.input<typeof orderSchema>;
export type OrderField = keyof OrderInput;
export type OrderFieldErrors = Partial<Record<OrderField, string>>;
export type OrderTextValues = Partial<Record<"customerName" | "phone" | "city" | "address", string>>;

export type OrderFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: OrderFieldErrors; values: OrderTextValues }
  | { status: "success"; orderRef: string; phone: string };

export function firstFieldErrors(error: z.ZodError): OrderFieldErrors {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const result: OrderFieldErrors = {};
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) result[field as OrderField] = messages[0];
  }
  return result;
}
