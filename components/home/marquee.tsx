"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/format";
import { Star } from "../ui/star";

const COPIES = 4;

function VelocityMarquee({
  items,
  baseVelocity,
  className,
  starClassName,
}: {
  items: readonly string[];
  baseVelocity: number;
  className?: string;
  starClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  // Wrapping over exactly one copy's width keeps the loop seamless.
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 whitespace-nowrap" style={{ x }}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div key={copy} aria-hidden={copy > 0} className={cn("flex shrink-0 items-center", className)}>
            {items.map((item) => (
              <Fragment key={item}>
                <span className="px-6 md:px-10">{item}</span>
                <Star className={cn("size-[0.55em] shrink-0", starClassName)} />
              </Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Announcements" className="relative z-10 -my-4 overflow-hidden py-16 md:py-24">
      <div className="relative z-10 -rotate-3 scale-[1.06] border-y border-black bg-blood py-3 font-display text-3xl uppercase tracking-wide text-black shadow-[0_0_80px_rgba(224,16,29,0.35)] md:py-4 md:text-5xl">
        <VelocityMarquee items={site.marqueePrimary} baseVelocity={-3} starClassName="text-black" />
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-2 scale-[1.06] border-y border-white/15 bg-ink py-3 font-display text-3xl uppercase tracking-wide md:py-4 md:text-5xl">
        <VelocityMarquee
          items={site.marqueeSecondary}
          baseVelocity={2.4}
          className="text-outline"
          starClassName="text-blood"
        />
      </div>
    </section>
  );
}
