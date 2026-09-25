import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function isPrivilegedKey(key: string): boolean {
  // Publishable/anon keys are subject to RLS and would silently fail every orders write.
  if (key.startsWith("sb_secret_")) return true;
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString("utf8"));
      return payload?.role === "service_role";
    } catch {
      return false;
    }
  }
  return false;
}

// Bypasses RLS — server only. Returns null when env vars are missing (demo mode).
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  if (!isPrivilegedKey(key)) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is a publishable/anon key, not the service_role secret. " +
        "Supabase → Project Settings → API Keys → service_role (or sb_secret_…). " +
        "Without it, RLS blocks writes to private tables such as orders.",
    );
  }

  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
