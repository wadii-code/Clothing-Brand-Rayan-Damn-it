"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "@/components/ui/star";
import { cn, formatOrderDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { logout, updateOrderStatus } from "./actions";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-blood/60 bg-blood/15 text-[#ff5a63]",
  confirmed: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  shipped: "border-sky-300/40 bg-sky-300/10 text-sky-200",
  delivered: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
  cancelled: "border-white/15 bg-white/5 text-white/40",
};

const AUTO_REFRESH_MS = 60_000;

type Filter = "all" | OrderStatus;

export function OrdersDashboard({ orders, error }: { orders: Order[]; error: string | null }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [, startUpdate] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [optimisticOrders, setOptimisticStatus] = useOptimistic(
    orders,
    (current, update: { id: string; status: OrderStatus }) =>
      current.map((o) => (o.id === update.id ? { ...o, status: update.status } : o)),
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") startRefresh(() => router.refresh());
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
    for (const o of optimisticOrders) byStatus[o.status] += 1;
    return byStatus;
  }, [optimisticOrders]);

  const stats = useMemo(() => {
    const open = optimisticOrders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status));
    const delivered = optimisticOrders.filter((o) => o.status === "delivered");
    return {
      openValue: open.reduce((sum, o) => sum + o.totalPrice, 0),
      revenue: delivered.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  }, [optimisticOrders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return optimisticOrders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return [o.customerName, o.phone, o.city, o.address, o.productName, o.ref]
        .some((value) => value.toLowerCase().includes(q));
    });
  }, [optimisticOrders, filter, query]);

  function changeStatus(order: Order, status: OrderStatus) {
    startUpdate(async () => {
      setOptimisticStatus({ id: order.id, status });
      const result = await updateOrderStatus(order.id, status);
      if (!result.ok) setToast(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Image src="/brand/sigil.png" alt="" width={48} height={48} className="size-11 animate-spin-slow" />
          <div>
            <p className="label-mono text-blood">Damnit / Control room</p>
            <h1 className="font-display text-4xl uppercase leading-none md:text-5xl">Orders</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => startRefresh(() => router.refresh())}
            className="flex h-10 items-center gap-2 border border-white/20 px-4 label-mono transition-colors hover:border-white"
          >
            <Star className={cn("size-3 text-blood", refreshing && "animate-spin")} />
            {refreshing ? "Syncing" : "Refresh"}
          </button>
          <form action={logout}>
            <button type="submit" className="h-10 border border-white/20 px-4 label-mono transition-colors hover:border-blood hover:bg-blood">
              Log out
            </button>
          </form>
        </div>
      </header>

      {error && (
        <p role="alert" className="mt-6 border border-blood/50 bg-blood/10 px-4 py-3 text-sm text-[#ff8a90]">
          {error}
        </p>
      )}

      <section className="mt-6 grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
        <Stat label="Total orders" value={String(optimisticOrders.length)} />
        <Stat label="Pending — call them" value={String(counts.pending)} accent={counts.pending > 0} />
        <Stat label="Open value" value={formatPrice(stats.openValue)} />
        <Stat label="Delivered revenue" value={formatPrice(stats.revenue)} />
      </section>

      <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {(["all", ...ORDER_STATUSES] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={cn(
                "relative shrink-0 px-4 py-2 label-mono transition-colors",
                filter === status ? "text-white" : "text-white/45 hover:text-white",
              )}
            >
              {filter === status && (
                <motion.span layoutId="order-filter" className="absolute inset-0 border border-blood bg-blood/15" transition={{ type: "spring", stiffness: 450, damping: 36 }} />
              )}
              <span className="relative">
                {status} <sup className="opacity-60">{status === "all" ? optimisticOrders.length : counts[status]}</sup>
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, city, ref…"
          aria-label="Search orders"
          className="h-11 w-full border border-white/15 bg-transparent px-4 text-sm placeholder:text-white/30 focus:border-white focus:outline-none lg:w-80"
        />
      </section>

      {visible.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
          <Star className="size-12 text-white/15" />
          <p className="font-display text-3xl uppercase text-white/60">
            {optimisticOrders.length === 0 ? "No orders yet" : "Nothing matches"}
          </p>
          <p className="label-mono text-white/35">
            {optimisticOrders.length === 0 ? "New orders land here automatically" : "Try another filter or search"}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto border border-white/10 lg:block">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 bg-coal">
                <tr className="label-mono text-white/45">
                  <th className="px-4 py-3 font-normal">Date / Ref</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Phone</th>
                  <th className="px-4 py-3 font-normal">City</th>
                  <th className="px-4 py-3 font-normal">Address</th>
                  <th className="px-4 py-3 font-normal">Product</th>
                  <th className="px-4 py-3 text-right font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {visible.map((order) => (
                    <motion.tr
                      key={order.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "border-b border-white/5 align-top transition-colors hover:bg-white/[0.03]",
                        order.status === "cancelled" && "opacity-50",
                      )}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-mono text-xs text-white/80">{formatOrderDate(order.createdAt)}</p>
                        <p className="mt-1 font-mono text-[11px] text-white/35">#{order.ref}</p>
                      </td>
                      <td className="px-4 py-4 font-medium uppercase">{order.customerName}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <PhoneLinks phone={order.phone} />
                      </td>
                      <td className="px-4 py-4 uppercase">{order.city}</td>
                      <td className="max-w-[280px] px-4 py-4 text-white/70">{order.address}</td>
                      <td className="px-4 py-4">
                        <ProductCell order={order} />
                      </td>
                      <td className="px-4 py-4 text-right font-mono whitespace-nowrap">{formatPrice(order.totalPrice)}</td>
                      <td className="px-4 py-4">
                        <StatusSelect order={order} onChange={changeStatus} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 lg:hidden">
            {visible.map((order) => (
              <li
                key={order.id}
                className={cn("border border-white/10 bg-coal p-4", order.status === "cancelled" && "opacity-50")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl uppercase leading-tight">{order.customerName}</p>
                    <p className="mt-1 font-mono text-[11px] text-white/40">
                      #{order.ref} · {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{formatPrice(order.totalPrice)}</p>
                </div>
                <div className="mt-4">
                  <ProductCell order={order} />
                </div>
                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 label-mono text-white/40">Phone</dt>
                    <dd><PhoneLinks phone={order.phone} /></dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 label-mono text-white/40">City</dt>
                    <dd className="uppercase">{order.city}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 label-mono text-white/40">Address</dt>
                    <dd className="text-white/70">{order.address}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <StatusSelect order={order} onChange={changeStatus} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-blood bg-ink px-5 py-3 label-mono text-blood shadow-2xl"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ink p-5 md:p-6">
      <p className="flex items-center gap-2 label-mono text-white/45">
        {accent && <span className="size-1.5 animate-blink rounded-full bg-blood" />}
        {label}
      </p>
      <p className={cn("mt-3 font-display text-3xl md:text-4xl", accent && "text-blood")}>{value}</p>
    </div>
  );
}

function PhoneLinks({ phone }: { phone: string }) {
  const international = /^0\d{9}$/.test(phone) ? `212${phone.slice(1)}` : null;
  return (
    <span className="flex items-center gap-3 font-mono">
      <a href={`tel:${phone}`} className="underline decoration-white/20 underline-offset-4 hover:text-blood hover:decoration-blood">
        {phone}
      </a>
      {international && (
        <a
          href={`https://wa.me/${international}`}
          target="_blank"
          rel="noreferrer"
          className="border border-emerald-400/30 px-1.5 py-0.5 text-[10px] tracking-widest text-emerald-300 hover:bg-emerald-400/10"
        >
          WA
        </a>
      )}
    </span>
  );
}

function ProductCell({ order }: { order: Order }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-smoke">
        {order.productImage && <Image src={order.productImage} alt="" fill sizes="44px" className="object-cover" />}
      </div>
      <div>
        <p className="font-medium uppercase leading-tight">{order.productName}</p>
        <p className="mt-1 label-mono text-white/45">
          {order.size ? `Size ${order.size}` : "One size"} · ×{order.quantity}
        </p>
      </div>
    </div>
  );
}

function StatusSelect({ order, onChange }: { order: Order; onChange: (order: Order, status: OrderStatus) => void }) {
  return (
    <div className="relative inline-block">
      <select
        value={order.status}
        onChange={(e) => onChange(order, e.target.value as OrderStatus)}
        aria-label={`Status for order ${order.ref}`}
        className={cn(
          "h-9 cursor-pointer appearance-none border py-0 pr-8 pl-3 label-mono focus:outline-none",
          STATUS_STYLES[order.status],
        )}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status} className="bg-ink text-white">
            {status}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 10 6" className="pointer-events-none absolute top-1/2 right-3 h-1.5 w-2.5 -translate-y-1/2 opacity-70" aria-hidden>
        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
