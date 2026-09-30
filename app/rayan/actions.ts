"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { createAdminSession, destroyAdminSession, isAdmin, passwordMatches } from "@/lib/admin-auth";
import { clientIp, createLimiter } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export type LoginState = { error: string | null; attempt: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 10 wrong passwords per address, then that address is locked out for 15 minutes.
const failedLogins = createLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });

export async function login(prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const ip = await clientIp();

  if (failedLogins.blocked(ip)) {
    return { error: "Too many attempts — try again in 15 minutes", attempt: prev.attempt + 1 };
  }

  if (!passwordMatches(password)) {
    failedLogins.hit(ip);
    await sleep(800); // slows brute-force guessing
    return { error: "Access denied", attempt: prev.attempt + 1 };
  }

  failedLogins.clear(ip);
  await createAdminSession();
  return { error: null, attempt: 0 };
}

export async function logout(): Promise<void> {
  await destroyAdminSession();
}

const statusInput = z.object({
  orderId: z.uuid(),
  status: z.enum(ORDER_STATUSES),
});

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Session expired — log in again." };

  const parsed = statusInput.safeParse({ orderId, status });
  if (!parsed.success) return { ok: false, error: "Invalid status update." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase is not connected." };

  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.orderId);

  if (error) {
    console.error("[skiro] status update failed", error);
    return { ok: false, error: "Could not update the order." };
  }

  refresh();
  return { ok: true };
}
