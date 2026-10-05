"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/format";
import { isPack } from "@/lib/pack";
import { useCheckout } from "../checkout/checkout-provider";
import { PackGiftNotice } from "../pack/pack-gift";
import { Arrow } from "../ui/arrow";

type Props = {
  product: Product;
  index?: number;
  badge?: string;
  sizes?: string;
  className?: string;
};

export function ProductCard({
  product,
  index = 0,
  badge = "New",
  sizes = "(min-width: 1024px) 33vw, 50vw",
  className,
}: Props) {
  const { openCheckout } = useCheckout();
  const href = `/product/${product.slug}`;
  const pack = isPack(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group relative", className)}
    >
      {pack && <PackGiftNotice className="mb-3" />}
      <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
        <Link href={href} aria-label={product.name} className="absolute inset-0 block">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            sizes={sizes}
            className={cn(
              "object-cover transition-[opacity,transform,filter] duration-700 ease-out-expo",
              product.hoverImage && "group-hover:scale-[1.04] group-hover:opacity-0 group-hover:blur-[2px]",
            )}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes={sizes}
              className="scale-[1.08] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          <span className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex gap-1.5">
          {badge && <span className="bg-blood px-2 py-1 label-mono text-white">{badge}</span>}
          <span className="bg-black/70 px-2 py-1 label-mono text-white/80 backdrop-blur">COD</span>
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-0 transition-all duration-500 ease-brutal md:translate-y-[calc(100%+1rem)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => openCheckout({ product })}
            className="flex w-full items-center justify-between bg-white px-4 py-3 font-display text-base uppercase tracking-wider text-black transition-colors duration-300 hover:bg-blood hover:text-white"
          >
            Quick order
            <span className="label-mono">Pay on delivery</span>
          </button>
        </div>
      </div>

      <Link href={href} className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-display text-xl uppercase leading-tight tracking-wide md:text-2xl">
            <span className="truncate">{product.name}</span>
            <Arrow className="size-4 shrink-0 -translate-x-2 text-blood opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
          </h3>
          {/* One line, so every card's text block is the same height and the images in a row line up. */}
          <p className="mt-1 truncate label-mono text-white/40">
            {product.category}
            {pack ? (
              <span> — Hoodie + Pants</span>
            ) : (
              product.sizes.length > 0 && <span className="hidden sm:inline"> — {product.sizes.join(" · ")}</span>
            )}
          </p>
        </div>
        <p className="shrink-0 font-mono text-sm text-white/85">{formatPrice(product.price)}</p>
      </Link>
    </motion.article>
  );
}
