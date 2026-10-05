"use client";

import { motion } from "framer-motion";
import { Star } from "../ui/star";

const STEPS = [
  {
    title: "Pick your piece",
    body: "Choose your size. No account, no sign-up, no password to forget.",
  },
  {
    title: "Drop 4 details",
    body: "Full name, phone, city, exact address. That's the whole checkout.",
  },
  {
    title: "Pay at your door",
    body: "We call to confirm, then ship for free. You pay cash when it lands in your hands.",
  },
];

export function CodSteps() {
  return (
    <section id="cod" className="scroll-mt-20 border-t border-white/10 bg-coal">
      <div className="mx-auto max-w-[1800px] px-4 py-24 md:px-8 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label-mono text-blood">(How it works)</p>
            <h2 className="mt-4 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
              Cash on
              <br />
              delivery.
            </h2>
          </div>
          <p className="max-w-sm text-sm uppercase leading-relaxed text-white/50">
            No card. No bank. No risk. You see it, you touch it, then you pay.
          </p>
        </div>

        <ol className="mt-16 grid gap-px bg-white/10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden bg-coal p-8 md:p-10"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-blood transition-transform duration-700 ease-brutal group-hover:scale-y-100" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-display text-7xl text-white/15 transition-colors duration-500 group-hover:text-black/30">
                    0{i + 1}
                  </span>
                  <Star className="size-10 text-blood transition-all duration-700 ease-brutal group-hover:rotate-90 group-hover:text-black" />
                </div>
                <h3 className="mt-10 font-display text-3xl uppercase">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55 transition-colors duration-500 group-hover:text-white/85">
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        <p className="mt-16 text-center font-display text-4xl uppercase md:text-6xl">
          No account. No card. <span className="text-blood">No excuses.</span>
        </p>
      </div>
    </section>
  );
}
