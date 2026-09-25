"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { CheckoutDrawer } from "./checkout-drawer";

export type CheckoutRequest = {
  product: Product;
  size?: string;
  quantity?: number;
};

type ActiveCheckout = CheckoutRequest & { session: number };

const CheckoutContext = createContext<{ openCheckout: (request: CheckoutRequest) => void } | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveCheckout | null>(null);

  // New session id → form remounts with a clean state.
  const openCheckout = useCallback((request: CheckoutRequest) => {
    setActive({ ...request, session: Date.now() });
  }, []);
  const close = useCallback(() => setActive(null), []);
  const value = useMemo(() => ({ openCheckout }), [openCheckout]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      <CheckoutDrawer checkout={active} onClose={close} />
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return context;
}
