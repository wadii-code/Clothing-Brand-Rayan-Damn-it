"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { createAdminSession, destroyAdminSession, isAdmin, passwordMatches } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export type LoginState = { error: string | null; attempt: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!passwordMatches(password)) {
    await sleep(800); // slows brute-force guessing
    return { error: "Access denied", attempt: prev.attempt + 1 };
  }

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
    console.error("[damnit] status update failed", error);
    return { ok: false, error: "Could not update the order." };
  }

  refresh();
  return { ok: true };
}
