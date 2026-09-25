"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const MANIFESTO =
  "We don't make clothes for everyone. We make armor for the ones who never fit in. Born in the dark. Stitched in red. Worn like a warning.";
const RED_WORDS = new Set(["armor", "red.", "warning."]);
const WORDS = MANIFESTO.split(" ");

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section className="relative mx-auto max-w-[1800px] px-4 py-32 md:px-8 md:py-48">
      <p className="label-mono text-white/40">(Manifesto)</p>
      <p ref={ref} className="mt-8 flex flex-wrap font-display text-[11vw] uppercase leading-[0.95] md:text-[6.4vw]">
        {WORDS.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / WORDS.length, (i + 1) / WORDS.length]}
            red={RED_WORDS.has(word.toLowerCase())}
          >
            {word}
          </Word>
        ))}
      </p>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  red,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  red: boolean;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, ["0.15em", "0em"]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.22em] inline-block ${red ? "text-blood" : ""}`}>
      {children}
    </motion.span>
  );
}
