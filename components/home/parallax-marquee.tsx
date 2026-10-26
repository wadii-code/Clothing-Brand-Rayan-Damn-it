"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { lookbook } from "@/lib/site";

// One row of portrait cards drifting left. Each card has a "depth": deeper cards run faster, sit
// bigger, tilt more in 3D and shift more as you scroll, so they overlap and pass each other.
// Same pictures as the lookbook, in the same order (pack → hoodie → pants).
const DEPTH = [20, 90, -40, 60, 0, 120, -30, 70, 10, 100, -50, 40];
const LIFT = [0, -0.12, 0.1, -0.06, 0.14, -0.1, 0.05, -0.14, 0.08, -0.04, 0.12, -0.08]; // × card height

const SPEED = 0.22; // card-widths per second
const GAP = 1.35; // card pitch, in card widths
const MAX_TILT = 14; // degrees at the screen edge for depth 100
const MAX_BOOST = 2.2; // extra speed while the page is being scrolled fast

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
// Per-card wrap: a card that leaves on the left re-enters on the right, whatever its own speed.
const wrap = (v: number, min: number, size: number) => ((((v - min) % size) + size) % size) + min;

export function ParallaxMarquee() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);
    if (!section || !track || cards.length === 0) return;

    let vw = 0;
    let vh = 0;
    let cardW = 0;
    let cardH = 0;
    let pitch = 0;
    let total = 0;
    let top = 0;
    let height = 0;
    let offset = 0;
    let lastY = window.scrollY;
    let lastTime = 0;
    let smoothVelocity = 0;
    let visible = false;
    let frame = 0;

    // Layout reads happen here only (on resize), never inside the animation frame.
    const measure = () => {
      const rect = section.getBoundingClientRect();
      vw = section.clientWidth;
      vh = window.innerHeight;
      cardW = cards[0].offsetWidth;
      cardH = cards[0].offsetHeight;
      pitch = cardW * GAP;
      // Wide enough that a card re-enters well off-screen, even on very wide displays.
      total = Math.max(cards.length * pitch, vw + 2 * pitch);
      top = rect.top + window.scrollY;
      height = rect.height;
    };

    // Writes only `transform`, so the browser never has to re-layout or re-paint a card.
    const paint = (scrollY: number, parallax: boolean) => {
      const progress = parallax ? clamp((scrollY + vh / 2 - (top + height / 2)) / (vh / 2 + height / 2), -1, 1) : 0;
      for (let i = 0; i < cards.length; i++) {
        const depth = DEPTH[i % DEPTH.length];
        const x = wrap(i * pitch - offset * (1 + depth / 250), -pitch, total);
        const tilt = clamp((x + cardW / 2 - vw / 2) / (vw / 2), -1, 1) * MAX_TILT * (depth / 100);
        const y = LIFT[i % LIFT.length] * cardH - cardH / 2 - progress * depth * 0.45 * (cardH / 300);
        cards[i].style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${(1 + depth / 300).toFixed(3)}) rotateY(${tilt.toFixed(2)}deg)`;
      }
    };

    const tick = (now: number) => {
      const dt = clamp((now - lastTime) / 1000, 0, 0.05);
      lastTime = now;
      const y = window.scrollY;
      if (dt > 0) smoothVelocity += (Math.abs(y - lastY) / dt - smoothVelocity) * (1 - Math.exp(-dt * 8));
      lastY = y;
      offset += cardW * SPEED * dt * (1 + Math.min(smoothVelocity / 1200, MAX_BOOST));
      paint(y, true);
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    // Only animate while the section is on screen and the tab is in front.
    const sync = () => {
      if (reduceMotion || !visible || document.hidden) return stop();
      if (frame) return;
      lastTime = performance.now();
      lastY = window.scrollY;
      smoothVelocity = 0;
      frame = requestAnimationFrame(tick);
    };

    const relayout = () => {
      measure();
      paint(window.scrollY, !reduceMotion);
      track.style.opacity = "1";
    };

    const resizeObserver = new ResizeObserver(relayout);
    resizeObserver.observe(section);
    resizeObserver.observe(document.body); // content above this section changing height moves it
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    intersectionObserver.observe(section);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduceMotion]);

  return (
    // Decorative: the same photos are in the lookbook below, with captions.
    <section ref={sectionRef} aria-hidden="true" className="relative overflow-hidden bg-ink py-10 [contain:layout_paint] md:py-16">
      <div
        className="relative h-[calc(var(--card-w)*2.35)] [--card-w:clamp(176px,19vw,300px)]"
        style={{ perspective: "1200px" }}
      >
        {/* Hidden until the first layout pass has positioned every card. */}
        <div ref={trackRef} className="absolute inset-0 opacity-0 transition-opacity duration-700">
          {lookbook.map((look, i) => (
            <div
              key={look.src}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ zIndex: DEPTH[i % DEPTH.length] + 100 }}
              className="absolute top-1/2 left-0 aspect-[4/5] w-[var(--card-w)] overflow-hidden bg-smoke shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 will-change-transform [backface-visibility:hidden]"
            >
              <Image
                src={look.src}
                alt=""
                fill
                draggable={false}
                sizes="(min-width: 1024px) 300px, 190px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-[400] w-[10vw] bg-linear-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[400] w-[10vw] bg-linear-to-l from-ink to-transparent" />
      </div>
    </section>
  );
}
