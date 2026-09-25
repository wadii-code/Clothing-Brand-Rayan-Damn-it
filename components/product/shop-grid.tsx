"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { LockedCard, ProductCard } from "./product-card";

const ALL = "all";

export function ShopGrid({ products }: { products: Product[] }) {
  const categories = [ALL, ...new Set(products.map((p) => p.category))];
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? products : products.filter((p) => p.category === active);

  return (
    <LayoutGroup>
      <div className="mt-12 flex flex-wrap items-center gap-2 border-y border-white/10 py-4">
        {categories.map((category) => {
          const count = category === ALL ? products.length : products.filter((p) => p.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={cn(
                "relative px-4 py-2 label-mono transition-colors",
                active === category ? "text-white" : "text-white/50 hover:text-white",
              )}
            >
              {active === category && (
                <motion.span layoutId="shop-filter" className="absolute inset-0 bg-blood" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">
                {category} <sup className="opacity-60">{count}</sup>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6">
        <AnimatePresence mode="popLayout">
          {visible.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} index={i} sizes="(min-width: 768px) 33vw, 50vw" />
            </motion.div>
          ))}
        </AnimatePresence>
        {active === ALL && visible.length < 3 && <LockedCard index={visible.length} />}
      </motion.div>
    </LayoutGroup>
  );
}
