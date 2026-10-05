"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PACK_GIFT } from "@/lib/pack";
import { cn } from "@/lib/format";

const POLL_MS = 20_000;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type GiftState = { left: number | null; refresh: () => Promise<void> };

const GiftContext = createContext<GiftState>({ left: null, refresh: async () => {} });

// The server renders the count it had (up to a minute old), then every open page polls so the
// number ticks down live as packs sell. null = no pack on sale: nothing is shown and nothing polls.
export function PackGiftProvider({ initialLeft, children }: { initialLeft: number | null; children: React.ReactNode }) {
  const [left, setLeft] = useState(initialLeft);
  const hasPack = initialLeft !== null;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/pack-gift", { cache: "no-store" });
      if (!res.ok) return;
      const data: { left?: unknown } = await res.json();
      if (typeof data.left === "number") setLeft(data.left);
    } catch {
      // Offline or a network blip: keep the last known count.
    }
  }, []);

  useEffect(() => {
    if (!hasPack) return;
    const tick = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    tick();
    const id = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [hasPack, refresh]);

  const value = useMemo(() => ({ left: hasPack ? left : null, refresh }), [hasPack, left, refresh]);
  return <GiftContext.Provider value={value}>{children}</GiftContext.Provider>;
}

export const usePackGift = () => useContext(GiftContext);

// Above the pack card and the pack's order button: the countdown to the last free gift.
export function PackGiftNotice({ className }: { className?: string }) {
  const { left } = usePackGift();
  if (left === null) return null;

  if (left === 0) {
    return (
      <p className={cn("border border-white/10 px-3 py-2.5 label-mono text-white/45", className)}>
        All {PACK_GIFT.total} free gifts claimed
      </p>
    );
  }

  return (
    <div role="status" className={cn("border border-blood/50 bg-blood/10 p-3", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="flex items-center gap-2 label-mono text-white">
            <LiveDot />
            Free gift — worth {PACK_GIFT.value} DH
          </p>
          <p className="mt-1 label-mono text-white/45">First {PACK_GIFT.total} packs only</p>
        </div>
        <p className="flex items-baseline gap-1.5 label-mono text-white/45">
          <RollingCount value={left} className="font-display text-3xl leading-none tracking-normal text-blood" />
          / {PACK_GIFT.total} left
        </p>
      </div>
      <div className="mt-3 h-0.5 bg-white/10">
        <motion.div
          className="h-full origin-left bg-blood"
          initial={false}
          animate={{ scaleX: left / PACK_GIFT.total }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
      </div>
    </div>
  );
}

// One-line version for tight spots: the slider and the checkout summary.
export function PackGiftLine({ className }: { className?: string }) {
  const { left } = usePackGift();
  if (left === null || left === 0) return null;

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 label-mono text-white/50", className)}>
      <LiveDot />
      <span className="text-white">+ Free gift worth {PACK_GIFT.value} DH</span>
      <span>
        — <RollingCount value={left} className="text-blood" /> / {PACK_GIFT.total} left
      </span>
    </p>
  );
}

function LiveDot() {
  return (
    <span aria-hidden className="relative flex size-2 shrink-0">
      <span className="absolute inset-0 animate-ping rounded-full bg-blood opacity-75 motion-reduce:animate-none" />
      <span className="relative size-2 rounded-full bg-blood" />
    </span>
  );
}

// Counting down, the new number drops in from above and pushes the old one out below.
function RollingCount({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="inline-block"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
