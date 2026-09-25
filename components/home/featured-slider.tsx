"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, wrap, type Variants } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCheckout } from "../checkout/checkout-provider";
import { Arrow } from "../ui/arrow";

const AUTOPLAY_MS = 6500;
const BRUTAL: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const frameVariants: Variants = {
  enter: (dir: number) => ({
    clipPath: dir >= 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    scale: 1.18,
    zIndex: 2,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    zIndex: 2,
    transition: { duration: 1.15, ease: BRUTAL },
  },
  exit: {
    scale: 0.94,
    opacity: 0.4,
    zIndex: 1,
    transition: { duration: 1.15, ease: BRUTAL },
  },
};

export function FeaturedSlider({ products }: { products: Product[] }) {
  const { openCheckout } = useCheckout();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const count = products.length;
  const index = wrap(0, count, page);
  const product = products[index];

  const paginate = useCallback((dir: number) => setPage(([p]) => [p + dir, dir]), []);

  useEffect(() => {
    if (!inView || count < 2) return;
    const timer = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [page, inView, count, paginate]);

  if (!product) return null;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured pieces"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") paginate(1);
        if (e.key === "ArrowLeft") paginate(-1);
      }}
      className="relative isolate overflow-hidden border-y border-white/10 bg-coal"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-10"
        >
          <Image src={product.mainImage} alt="" fill sizes="30vw" className="scale-125 object-cover opacity-30 blur-3xl" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_50%,transparent,rgba(0,0,0,0.85)_70%)]" />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.p
            key={product.id}
            custom={direction}
            initial={{ x: direction >= 0 ? "25%" : "-25%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1, transition: { duration: 1.4, ease: EASE_OUT } }}
            exit={{ x: direction >= 0 ? "-25%" : "25%", opacity: 0, transition: { duration: 0.8, ease: BRUTAL } }}
            className="whitespace-nowrap font-display text-[22vw] uppercase leading-none text-outline"
          >
            {product.name}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mx-auto grid max-w-[1800px] items-center gap-10 px-4 py-16 md:grid-cols-12 md:gap-8 md:px-8 md:py-24">
        <div className="order-2 md:order-1 md:col-span-5">
          <div className="flex items-center gap-4 label-mono text-white/50">
            <span className="text-blood">Featured</span>
            <span className="h-px w-10 bg-white/20" />
            <span>
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={product.id} initial="hidden" animate="visible" exit="exit">
              <div className="overflow-hidden">
                <motion.h2
                  variants={{
                    hidden: { y: "105%" },
                    visible: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
                    exit: { y: "-105%", transition: { duration: 0.45, ease: BRUTAL } },
                  }}
                  className="mt-6 font-display text-6xl uppercase leading-[0.9] md:text-7xl xl:text-8xl"
                >
                  {product.name}
                </motion.h2>
              </div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.8, ease: EASE_OUT } },
                  exit: { opacity: 0, transition: { duration: 0.3 } },
                }}
              >
                <div className="mt-6 flex items-center gap-4">
                  <span className="font-display text-4xl text-blood">{formatPrice(product.price)}</span>
                  <span className="border border-white/15 px-2 py-1 label-mono text-white/60">{product.category}</span>
                </div>
                {product.description && (
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">{product.description}</p>
                )}
                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openCheckout({ product })}
                    className="group relative overflow-hidden bg-blood px-7 py-4 font-display text-lg uppercase tracking-wider"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-brutal group-hover:scale-y-100" />
                    <span className="relative transition-colors duration-500 group-hover:text-black">Order now</span>
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="group flex items-center gap-3 border border-white/20 px-7 py-4 font-display text-lg uppercase tracking-wider transition-colors hover:border-white"
                  >
                    View piece
                    <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <div className="mt-14 flex items-center gap-6">
              <div className="flex gap-2">
                <SlideButton label="Previous piece" onClick={() => paginate(-1)} flip />
                <SlideButton label="Next piece" onClick={() => paginate(1)} />
              </div>
              <div className="flex flex-1 gap-2">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`Show ${p.name}`}
                    aria-current={i === index}
                    onClick={() => i !== index && setPage([page + (i - index), i > index ? 1 : -1])}
                    className="relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/15" />
                    {i === index && (
                      <motion.span
                        key={`${page}-${inView}`}
                        className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-blood"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: inView ? 1 : 0 }}
                        transition={{ duration: inView ? AUTOPLAY_MS / 1000 : 0, ease: "linear" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="order-1 md:order-2 md:col-span-7">
          <motion.div
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = offset.x * Math.abs(velocity.x);
              if (swipe < -6000 || offset.x < -120) paginate(1);
              else if (swipe > 6000 || offset.x > 120) paginate(-1);
            }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[560px] cursor-grab touch-pan-y active:cursor-grabbing md:max-h-[78svh]"
          >
            <div className="absolute inset-0 overflow-hidden bg-smoke">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={product.id}
                  custom={direction}
                  variants={frameVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    draggable={false}
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {product.hoverImage && (
              <div className="absolute -bottom-8 -left-4 hidden aspect-[3/4] w-[34%] overflow-hidden border-4 border-coal bg-smoke shadow-2xl sm:block md:-left-16">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={product.id}
                    custom={direction}
                    variants={frameVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ delay: 0.15 }}
                    className="absolute inset-0"
                  >
                    <Image src={product.hoverImage} alt="" fill draggable={false} sizes="200px" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            <span className="absolute -top-3 -right-3 z-10 bg-blood px-3 py-1.5 label-mono text-white">Pay on delivery</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SlideButton({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group flex size-12 items-center justify-center border border-white/20 transition-colors duration-300 hover:border-blood hover:bg-blood"
    >
      <Arrow className={`size-5 transition-transform duration-300 ${flip ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
    </button>
  );
}
