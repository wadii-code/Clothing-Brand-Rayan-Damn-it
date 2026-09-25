"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { lookbook, site } from "@/lib/site";

export function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(() => -progress.get() * distance.get());
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="lookbook" ref={sectionRef} className="relative h-[420vh] scroll-mt-20 bg-ink">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex h-full w-max items-center gap-6 pl-4 pr-[10vw] will-change-transform md:gap-10 md:pl-8">
          <div className="flex w-[85vw] shrink-0 flex-col justify-center md:w-[46vw]">
            <p className="label-mono text-blood">({site.drop}) — Editorial</p>
            <h2 className="mt-4 font-display text-[22vw] uppercase leading-[0.8] md:text-[11vw]">
              Look
              <br />
              <span className="text-outline-red">book</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm uppercase leading-relaxed text-white/50">
              Shot against raw concrete. Black cotton, red thread, no compromise. Keep scrolling →
            </p>
          </div>

          {lookbook.map((look, i) => (
            <figure
              key={look.src}
              className={`group relative shrink-0 ${i % 2 === 0 ? "self-start mt-[12svh]" : "self-end mb-[12svh]"}`}
            >
              <div className="relative h-[58svh] overflow-hidden bg-smoke md:h-[68svh]" style={{ aspectRatio: "3 / 4.2" }}>
                <Image
                  src={look.src}
                  alt={look.caption}
                  fill
                  sizes="(min-width: 768px) 40vw, 80vw"
                  className="object-cover grayscale-[70%] transition-[filter,transform] duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="absolute top-3 left-3 bg-black/70 px-2 py-1 label-mono text-white backdrop-blur">
                  {look.look}
                </span>
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-6 label-mono text-white/50">
                <span>{look.caption}</span>
                <span className="text-blood">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>

        <div className="absolute inset-x-4 bottom-6 h-px bg-white/10 md:inset-x-8">
          <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-blood" />
        </div>
      </div>
    </section>
  );
}
