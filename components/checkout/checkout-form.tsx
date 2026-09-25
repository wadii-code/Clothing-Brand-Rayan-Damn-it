"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { placeOrder } from "@/app/(store)/actions";
import {
  firstFieldErrors,
  orderSchema,
  type OrderField,
  type OrderFieldErrors,
  type OrderFormState,
} from "@/lib/order-schema";
import { cn, formatPrice } from "@/lib/format";
import { moroccanCities, site } from "@/lib/site";
import type { CheckoutRequest } from "./checkout-provider";
import { Star } from "../ui/star";

const FIELD_ORDER: OrderField[] = ["size", "quantity", "customerName", "phone", "city", "address"];
const INITIAL_STATE: OrderFormState = { status: "idle" };

type Props = { checkout: CheckoutRequest; onClose: () => void };

export function CheckoutForm({ checkout, onClose }: Props) {
  const { product } = checkout;
  const hasSizes = product.sizes.length > 0;

  const [state, formAction, pending] = useActionState(placeOrder, INITIAL_STATE);
  const [size, setSize] = useState(checkout.size ?? (product.sizes.length === 1 ? product.sizes[0] : ""));
  const [quantity, setQuantity] = useState(checkout.quantity ?? 1);
  const [clientErrors, setClientErrors] = useState<OrderFieldErrors>({});
  const [edited, setEdited] = useState<ReadonlySet<OrderField>>(new Set());

  const serverErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  const total = product.price * quantity;

  const errorFor = (field: OrderField) =>
    clientErrors[field] ?? (edited.has(field) ? undefined : serverErrors[field]);

  const markEdited = (field: OrderField) => {
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (!edited.has(field)) setEdited((prev) => new Set(prev).add(field));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const result = orderSchema.safeParse(Object.fromEntries(new FormData(form)));
    const errors: OrderFieldErrors = result.success ? {} : firstFieldErrors(result.error);
    if (hasSizes && !size) errors.size = "Pick a size";

    if (Object.keys(errors).length > 0) {
      e.preventDefault(); // blocks the server action
      setClientErrors(errors);
      const first = FIELD_ORDER.find((field) => errors[field]);
      form.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    setEdited(new Set());
  }

  if (state.status === "success") {
    return <OrderConfirmed orderRef={state.orderRef} phone={state.phone} total={total} onClose={onClose} />;
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex h-full flex-col">
      <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="label-mono text-blood">Checkout</p>
          <h2 id="checkout-title" className="mt-1 font-display text-3xl uppercase leading-none">
            Cash on delivery
          </h2>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
        <div className="flex gap-4">
          <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-smoke">
            <Image src={product.mainImage} alt={product.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div>
              <p className="truncate font-display text-xl uppercase leading-tight">{product.name}</p>
              <p className="label-mono text-white/40">{product.category}</p>
            </div>
            <p className="font-mono text-sm text-white/80">{formatPrice(product.price)}</p>
          </div>
        </div>

        <input type="hidden" name="productId" value={product.id} />

        {hasSizes ? (
          <fieldset className="mt-8">
            <legend className="label-mono text-white/50">Size</legend>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-describedby={errorFor("size") ? "size-error" : undefined}>
              {product.sizes.map((s, i) => (
                <label key={s} className="relative">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={() => {
                      setSize(s);
                      markEdited("size");
                    }}
                    data-field={i === 0 ? "size" : undefined}
                    className="peer sr-only"
                  />
                  <span className="flex h-11 min-w-12 items-center justify-center border border-white/20 px-3 font-mono text-sm transition-colors duration-200 hover:border-white peer-checked:border-blood peer-checked:bg-blood peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blood">
                    {s}
                  </span>
                </label>
              ))}
            </div>
            <FieldError id="size-error" message={errorFor("size")} />
          </fieldset>
        ) : (
          <input type="hidden" name="size" value="" />
        )}

        <div className="mt-6">
          <p className="label-mono text-white/50">Quantity</p>
          <div className="mt-3 inline-flex items-center border border-white/20">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex size-11 items-center justify-center text-lg transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              −
            </button>
            <output data-field="quantity" className="w-10 text-center font-mono" aria-live="polite">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10}
              className="flex size-11 items-center justify-center text-lg transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              +
            </button>
          </div>
          <input type="hidden" name="quantity" value={quantity} />
        </div>

        <div className="mt-10 flex items-center gap-3">
          <Star className="size-3 text-blood" />
          <p className="label-mono text-white/50">Delivery details</p>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mt-2 space-y-6">
          <TextField
            name="customerName"
            label="Full name"
            autoComplete="name"
            placeholder="Your first and last name"
            defaultValue={values.customerName}
            error={errorFor("customerName")}
            onEdit={markEdited}
          />
          <TextField
            name="phone"
            label="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 00 00 00 00"
            defaultValue={values.phone}
            error={errorFor("phone")}
            onEdit={markEdited}
          />
          <TextField
            name="city"
            label="City"
            autoComplete="address-level2"
            placeholder="Casablanca"
            list="moroccan-cities"
            defaultValue={values.city}
            error={errorFor("city")}
            onEdit={markEdited}
          />
          <datalist id="moroccan-cities">
            {moroccanCities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <TextField
            name="address"
            label="Exact address"
            autoComplete="street-address"
            placeholder="Street, number, building, apartment, landmark"
            multiline
            defaultValue={values.address}
            error={errorFor("address")}
            onEdit={markEdited}
          />
        </div>

        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <p className="mt-8 border-l-2 border-blood pl-4 text-xs leading-relaxed text-white/50">{site.checkoutNote}</p>
      </div>

      <div className="border-t border-white/10 bg-ink px-6 py-5">
        <AnimatePresence>
          {state.status === "error" && edited.size === 0 && Object.keys(clientErrors).length === 0 && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 label-mono text-blood"
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="mb-4 flex items-baseline justify-between">
          <span className="label-mono text-white/50">Total — pay on delivery</span>
          <span className="font-display text-3xl">{formatPrice(total)}</span>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="group relative flex h-14 w-full items-center justify-center overflow-hidden bg-blood font-display text-xl uppercase tracking-wider text-white disabled:cursor-wait"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-brutal group-enabled:group-hover:scale-x-100" />
          <span className="relative flex items-center gap-3 transition-colors duration-500 group-enabled:group-hover:text-black">
            {pending ? (
              <>
                <Star className="size-5 animate-spin" /> Placing order…
              </>
            ) : (
              "Confirm order"
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

type TextFieldProps = {
  name: "customerName" | "phone" | "city" | "address";
  label: string;
  error?: string;
  multiline?: boolean;
  onEdit: (field: OrderField) => void;
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "inputMode" | "autoComplete" | "placeholder" | "defaultValue" | "list"
>;

function TextField({ name, label, error, multiline, onEdit, ...inputProps }: TextFieldProps) {
  const id = `checkout-${name}`;
  const shared = {
    id,
    name,
    "data-field": name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    onChange: () => onEdit(name),
    placeholder: inputProps.placeholder,
    autoComplete: inputProps.autoComplete,
    defaultValue: inputProps.defaultValue,
    className: cn(
      "mt-1 w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-base text-white placeholder:text-white/25 transition-colors duration-300 focus:outline-none",
      error ? "border-blood" : "border-white/20 focus:border-white",
    ),
  };

  return (
    <div>
      <label htmlFor={id} className="label-mono text-white/50">
        {label}
      </label>
      {multiline ? (
        <textarea rows={2} {...shared} />
      ) : (
        <input type={inputProps.type ?? "text"} inputMode={inputProps.inputMode} list={inputProps.list} {...shared} />
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 label-mono text-blood"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close checkout"
      className="group -mr-2 flex size-10 items-center justify-center transition-transform duration-500 ease-brutal hover:rotate-90"
    >
      <span className="absolute h-px w-5 rotate-45 bg-white group-hover:bg-blood" />
      <span className="absolute h-px w-5 -rotate-45 bg-white group-hover:bg-blood" />
    </button>
  );
}

function OrderConfirmed({
  orderRef,
  phone,
  total,
  onClose,
}: {
  orderRef: string;
  phone: string;
  total: number;
  onClose: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex justify-end px-6 py-5">
        <CloseButton onClick={onClose} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 11 }}
        >
          <Star className="size-24 text-blood drop-shadow-[0_0_40px_rgba(224,16,29,0.6)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mt-10 label-mono text-white/40">Order #{orderRef}</p>
          <h2 id="checkout-title" className="mt-3 font-display text-6xl uppercase leading-none">
            It&apos;s yours.
          </h2>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            {phone ? (
              <>
                We&apos;ll call you on <span className="font-mono text-white">{phone}</span> to confirm.
              </>
            ) : (
              <>We&apos;ll call you to confirm.</>
            )}{" "}
            Have <span className="text-white">{formatPrice(total)}</span> in cash ready when it arrives.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-10 border border-white/20 px-8 py-4 font-display text-lg uppercase tracking-wider transition-colors hover:border-blood hover:bg-blood"
          >
            Keep browsing
          </button>
        </motion.div>
      </div>
    </div>
  );
}
