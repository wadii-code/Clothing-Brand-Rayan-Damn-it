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

const WORD = "DAMNIT".split("");
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
        <motion.div style={{ scale: sigilScale, rotate: sigilRotate, opacity: sigilOpacity }} className="w-[min(118vw,88vh)] md:w-[min(80vw,92vh)]">
          <motion.div
            initial={{ scale: 0.55, rotate: -60, opacity: 0, filter: "blur(18px)" }}
            animate={{ scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.4, ease: EASE_OUT }}
          >
            <Image
              src="/brand/sigil.png"
              alt=""
              width={1200}
              height={1200}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 80vw, 118vw"
              className="h-auto w-full animate-spin-slow drop-shadow-[0_0_60px_rgba(224,16,29,0.35)]"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.h1
          style={{ y: wordY }}
          className="flex select-none font-display text-[27vw] leading-[0.8] tracking-[-0.01em] [text-shadow:0_0_90px_rgba(224,16,29,0.45)] md:text-[24vw] xl:text-[22vw]"
        >
          <span className="sr-only">DAMNIT</span>
          {WORD.map((letter, i) => (
            <HeroLetter key={i} letter={letter} index={i} progress={progress} />
          ))}
        </motion.h1>
      </div>

      <motion.div style={{ opacity: chromeOpacity }} className="pointer-events-none absolute inset-0 mx-auto max-w-[1800px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute inset-x-4 top-24 flex justify-between label-mono text-white/55 md:inset-x-8 md:top-28"
        >
          <span>({site.drop})</span>
          <span className="hidden sm:block">Underground wear — Maroc</span>
          <span>{site.season}</span>
        </motion.div>

        <div className="absolute inset-x-4 bottom-8 flex flex-col items-start gap-6 md:inset-x-8 md:bottom-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: EASE_OUT }}
            className="max-w-xs text-sm uppercase leading-relaxed text-white/70"
          >
            {site.tagline}. Order online — <span className="text-white">pay cash at your door.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 1, ease: EASE_OUT }}
            className="pointer-events-auto"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-4 overflow-hidden bg-blood px-7 py-4 font-display text-lg uppercase tracking-wider text-white"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-brutal group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-black">Shop the drop</span>
              <Arrow className="relative size-5 transition-all duration-500 group-hover:translate-x-1 group-hover:text-black" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="hidden items-center gap-3 label-mono text-white/50 md:flex"
          >
            Scroll
            <span className="relative h-12 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 animate-scroll-line bg-blood" />
            </span>
          </motion.div>
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
    <motion.span aria-hidden style={{ x, y, rotate }} className="inline-block overflow-hidden px-[0.01em] pb-[0.02em]">
      <motion.span
        className="inline-block"
        initial={{ y: "110%", rotate: 6 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ delay: 0.35 + index * 0.08, duration: 1.3, ease: EASE_OUT }}
      >
        <motion.span
          className="inline-block"
          whileHover={{ color: "#e0101d", skewX: -8, y: "-4%" }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {letter}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}
