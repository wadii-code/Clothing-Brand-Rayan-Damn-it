"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

// The drawer (form + validation) is kept out of the initial bundle and fetched once the page is idle.
const CheckoutDrawer = dynamic(() => import("./checkout-drawer").then((m) => m.CheckoutDrawer), { ssr: false });

export type CheckoutRequest = {
  product: Product;
  size?: string;
  quantity?: number;
};

type ActiveCheckout = CheckoutRequest & { session: number };

const CheckoutContext = createContext<{ openCheckout: (request: CheckoutRequest) => void } | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveCheckout | null>(null);
  const [drawerMounted, setDrawerMounted] = useState(false);

  useEffect(() => {
    const mount = () => setDrawerMounted(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(mount, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(mount, 1500);
    return () => window.clearTimeout(id);
  }, []);

  // New session id → form remounts with a clean state.
  const openCheckout = useCallback((request: CheckoutRequest) => {
    setDrawerMounted(true);
    setActive({ ...request, session: Date.now() });
  }, []);
  const close = useCallback(() => setActive(null), []);
  const value = useMemo(() => ({ openCheckout }), [openCheckout]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      {drawerMounted && <CheckoutDrawer checkout={active} onClose={close} />}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return context;
}
