"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { site } from "@/lib/site";
import { Arrow } from "../ui/arrow";

const WORD = "SKIRO".split("");

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const sigilScale = useTransform(progress, [0, 1], [1, 1.55]);
  const sigilRotate = useTransform(progress, [0, 1], [0, 75]);
  const sigilOpacity = useTransform(progress, [0, 0.85], [0.6, 0]);
  const wordY = useTransform(progress, [0, 1], ["0%", "55%"]);
  const chromeOpacity = useTransform(progress, [0, 0.35], [1, 0]);

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(45);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${pointerX}% ${pointerY}%, rgba(224,16,29,0.22), transparent 65%)`;

  return (
    <section
      ref={sectionRef}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerX.set(((e.clientX - rect.left) / rect.width) * 100);
        pointerY.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      className="relative isolate h-svh min-h-[620px] overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_55%,rgba(92,8,16,0.75),transparent_62%)]" />
      <motion.div className="absolute inset-0 -z-10" style={{ background: spotlight }} />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-ink to-transparent" />

      <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        {/* will-change: framer rewrites this transform on every scroll frame; on its own layer that costs no repaint. */}
        <motion.div
          style={{ scale: sigilScale, rotate: sigilRotate, opacity: sigilOpacity }}
          className="relative w-[min(118vw,88vh)] will-change-transform md:w-[min(80vw,92vh)]"
        >
          {/* A static glow instead of a drop-shadow filter: a 60px blur on a spinning image is recomputed every frame. */}
          <div aria-hidden className="absolute -inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(224,16,29,0.3),transparent_62%)]" />
          <div className="relative animate-sigil-in">
            <Image
              src="/brand/sigil.png"
              alt=""
              width={1200}
              height={1200}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 80vw, 118vw"
              className="h-auto w-full animate-spin-slow"
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Named with aria-label, not an sr-only copy, so crawlers reading the text see the word once. */}
        <motion.h1
          style={{ y: wordY }}
          aria-label={site.name}
          className="flex select-none font-display text-[27vw] leading-[0.8] tracking-[-0.01em] [text-shadow:0_0_90px_rgba(224,16,29,0.45)] md:text-[24vw] xl:text-[22vw]"
        >
          {WORD.map((letter, i) => (
            <HeroLetter key={i} letter={letter} index={i} progress={progress} />
          ))}
        </motion.h1>
      </div>

      <motion.div style={{ opacity: chromeOpacity }} className="pointer-events-none absolute inset-0 mx-auto max-w-[1800px] px-4 md:px-8">
        <div
          style={{ animationDelay: "0.6s" }}
          className="absolute inset-x-4 top-24 flex animate-fade-in justify-between label-mono text-white/55 md:inset-x-8 md:top-28"
        >
          <span>({site.drop})</span>
          <span className="hidden sm:block">Underground wear — Maroc</span>
          <span>{site.season}</span>
        </div>

        <div className="absolute inset-x-4 bottom-8 flex flex-col items-start gap-6 md:inset-x-8 md:bottom-10 md:flex-row md:items-end md:justify-between">
          {/* The largest text above the fold, so it is what the browser times as "largest paint": it must not wait on JS. */}
          <p
            style={{ animationDelay: "0.45s" }}
            className="max-w-xs animate-rise text-sm uppercase leading-relaxed text-white/70"
          >
            {site.tagline}. Order online — <span className="text-white">pay cash at your door.</span>
          </p>

          <div style={{ animationDelay: "0.55s" }} className="pointer-events-auto animate-rise">
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-4 overflow-hidden bg-blood px-7 py-4 font-display text-lg uppercase tracking-wider text-white"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-brutal group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-black">Shop the drop</span>
              <Arrow className="relative size-5 transition-all duration-500 group-hover:translate-x-1 group-hover:text-black" />
            </Link>
          </div>

          <div
            style={{ animationDelay: "0.9s" }}
            className="hidden animate-fade-in items-center gap-3 label-mono text-white/50 md:flex"
          >
            Scroll
            <span className="relative h-12 w-px overflow-hidden bg-white/14">
              <span className="absolute inset-0 animate-scroll-line bg-blood" />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HeroLetter({ letter, index, progress }: { letter: string; index: number; progress: MotionValue<number> }) {
  const fromCenter = index - (WORD.length - 1) / 2;
  const x = useTransform(progress, [0, 1], ["0vw", `${fromCenter * 7}vw`]);
  const y = useTransform(progress, [0, 1], ["0%", `${(index % 2 === 0 ? 1 : -1) * 18}%`]);
  const rotate = useTransform(progress, [0, 1], [0, fromCenter * 4]);

  return (
    <motion.span
      aria-hidden
      style={{ x, y, rotate }}
      className="inline-block overflow-hidden px-[0.01em] pb-[0.02em] will-change-transform"
    >
      {/* CSS reveal: the headline starts rising at first paint, not after the JS bundle has hydrated. */}
      <span style={{ animationDelay: `${0.15 + index * 0.07}s` }} className="inline-block animate-letter-in">
        <motion.span
          className="inline-block"
          whileHover={{ color: "#e0101d", skewX: -8, y: "-4%" }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {letter}
        </motion.span>
      </span>
    </motion.span>
  );
}
