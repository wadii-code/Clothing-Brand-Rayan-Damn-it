"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/format";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/#lookbook", label: "Lookbook" },
  { href: "/#cod", label: "How it works" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 160);
    setScrolled(y > 24);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 md:h-20 md:px-8">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <Image
              src="/brand/sigil.png"
              alt=""
              width={40}
              height={40}
              className="size-9 transition-transform duration-[1.2s] ease-out-expo group-hover:rotate-[135deg] md:size-10"
            />
            <span className="font-display text-2xl tracking-wide md:text-[1.7rem]">DAMNIT</span>
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group relative label-mono text-white/70 transition-colors hover:text-white">
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-blood transition-transform duration-500 ease-brutal group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 border border-white/15 px-3 py-1.5 label-mono text-white/80 sm:flex">
              <span className="size-1.5 animate-blink rounded-full bg-blood" />
              Cash on delivery
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex size-10 items-center justify-center lg:hidden"
            >
              <span className={cn("absolute h-px w-6 bg-white transition-transform duration-300", menuOpen ? "rotate-45" : "-translate-y-1")} />
              <span className={cn("absolute h-px w-6 bg-white transition-transform duration-300", menuOpen ? "-rotate-45" : "translate-y-1")} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-4 pt-24 pb-10 lg:hidden"
          >
            <ul className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-6xl uppercase leading-[1.05] transition-colors active:text-blood"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 label-mono text-white/60">
              <span className="size-1.5 animate-blink rounded-full bg-blood" />
              Pay cash when it reaches your door
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
