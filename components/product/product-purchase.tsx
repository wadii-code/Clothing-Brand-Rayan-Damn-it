"use client";

import { useState } from "react";
import { motion, useAnimate } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/format";
import { useCheckout } from "../checkout/checkout-provider";

export function ProductPurchase({ product }: { product: Product }) {
  const { openCheckout } = useCheckout();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [quantity, setQuantity] = useState(1);
  const [needsSize, setNeedsSize] = useState(false);
  const [scope, animate] = useAnimate();

  function order() {
    if (product.sizes.length > 0 && !size) {
      setNeedsSize(true);
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 });
      return;
    }
    openCheckout({ product, size, quantity });
  }

  return (
    <div className="mt-10">
      {product.sizes.length > 0 && (
        <div ref={scope}>
          <div className="flex items-center justify-between">
            <p className={cn("label-mono transition-colors", needsSize ? "text-blood" : "text-white/50")}>
              {needsSize ? "Select a size first" : "Size"}
            </p>
            {size && <p className="label-mono text-white/70">Selected: {size}</p>}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setNeedsSize(false);
                }}
                className={cn(
                  "relative h-12 border font-mono text-sm transition-colors duration-200",
                  size === s
                    ? "border-blood text-white"
                    : needsSize
                      ? "border-blood/60 text-white/80 hover:border-blood"
                      : "border-white/20 text-white/80 hover:border-white",
                )}
              >
                {size === s && (
                  <motion.span
                    layoutId={`size-${product.id}`}
                    className="absolute inset-0 bg-blood"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>
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
        Pay cash on delivery — no card needed
      </p>
    </div>
  );
}
