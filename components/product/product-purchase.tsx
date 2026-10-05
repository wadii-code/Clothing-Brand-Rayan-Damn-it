"use client";

import { useState } from "react";
import { motion, useAnimate } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/format";
import { isPack } from "@/lib/pack";
import { useCheckout } from "../checkout/checkout-provider";
import { PackGiftNotice } from "../pack/pack-gift";

export function ProductPurchase({ product }: { product: Product }) {
  const { openCheckout } = useCheckout();
  const pack = isPack(product);
  const hasSizes = product.sizes.length > 0;
  const onlySize = product.sizes.length === 1 ? product.sizes[0] : "";
  const [size, setSize] = useState(onlySize);
  const [pantsSize, setPantsSize] = useState(onlySize);
  const [quantity, setQuantity] = useState(1);
  const [needsSize, setNeedsSize] = useState(false);
  const [scope, animate] = useAnimate();

  function order() {
    if (hasSizes && (!size || (pack && !pantsSize))) {
      setNeedsSize(true);
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 });
      return;
    }
    openCheckout({ product, size, pantsSize: pack ? pantsSize : undefined, quantity });
  }

  return (
    <div className="mt-10">
      {pack && <PackGiftNotice className="mb-8" />}

      {hasSizes && (
        <div ref={scope} className="space-y-6">
          <SizePicker
            id={`${product.id}-size`}
            label={pack ? "Hoodie size" : "Size"}
            sizes={product.sizes}
            value={size}
            invalid={needsSize && !size}
            onChange={(s) => {
              setSize(s);
              if (!pack || pantsSize) setNeedsSize(false);
            }}
          />
          {pack && (
            <SizePicker
              id={`${product.id}-pants-size`}
              label="Pants size"
              sizes={product.sizes}
              value={pantsSize}
              invalid={needsSize && !pantsSize}
              onChange={(s) => {
                setPantsSize(s);
                if (size) setNeedsSize(false);
              }}
            />
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <div className="flex items-center border border-white/20">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-14 w-11 items-center justify-center text-lg hover:bg-white/10 disabled:opacity-30"
          >
            −
          </button>
          <span className="w-8 text-center font-mono" aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="flex h-14 w-11 items-center justify-center text-lg hover:bg-white/10 disabled:opacity-30"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={order}
          className="group relative flex h-14 flex-1 items-center justify-between overflow-hidden bg-blood px-6 font-display text-lg uppercase tracking-wider"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-brutal group-hover:scale-x-100" />
          <span className="relative transition-colors duration-500 group-hover:text-black">Order now</span>
          <span className="relative font-mono text-sm transition-colors duration-500 group-hover:text-black">
            {formatPrice(product.price * quantity)}
          </span>
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 label-mono text-white/40">
        <span className="size-1.5 animate-blink rounded-full bg-blood" />
        Free delivery — pay cash at your door, no card needed
      </p>
    </div>
  );
}

function SizePicker({
  id,
  label,
  sizes,
  value,
  invalid,
  onChange,
}: {
  id: string;
  label: string;
  sizes: string[];
  value: string;
  invalid: boolean;
  onChange: (size: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className={cn("label-mono transition-colors", invalid ? "text-blood" : "text-white/50")}>
          {invalid ? `Select a ${label.toLowerCase()} first` : label}
        </p>
        {value && <p className="label-mono text-white/70">Selected: {value}</p>}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label={label}>
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={value === s}
            onClick={() => onChange(s)}
            className={cn(
              "relative h-12 border font-mono text-sm transition-colors duration-200",
              value === s
                ? "border-blood text-white"
                : invalid
                  ? "border-blood/60 text-white/80 hover:border-blood"
                  : "border-white/20 text-white/80 hover:border-white",
            )}
          >
            {value === s && (
              <motion.span
                layoutId={id}
                className="absolute inset-0 bg-blood"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
