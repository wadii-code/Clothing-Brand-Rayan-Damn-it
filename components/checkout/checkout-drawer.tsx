"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CheckoutRequest } from "./checkout-provider";
import { CheckoutForm } from "./checkout-form";

type Props = {
  checkout: (CheckoutRequest & { session: number }) | null;
  onClose: () => void;
};

const FOCUSABLE = ["a[href]", "button", "input:not([type=hidden])", "select", "textarea", "[tabindex]"]
  .map((selector) => `${selector}:not([disabled]):not([tabindex="-1"])`)
  .join(",");

// Keeps Tab / Shift+Tab cycling inside the dialog instead of reaching the page behind it.
function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0,
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  const outside = !container.contains(active);

  if (e.shiftKey && (active === first || active === container || outside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || outside)) {
    e.preventDefault();
    first.focus();
  }
}

export function CheckoutDrawer({ checkout, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = checkout !== null;

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    root.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {checkout && (
        <div className="fixed inset-0 z-[70]" key="checkout">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col overflow-hidden border-l border-white/10 bg-coal outline-none"
          >
            <CheckoutForm key={checkout.session} checkout={checkout} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
