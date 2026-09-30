import "server-only";
import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// In-memory and per server instance: it stops one client hammering an endpoint, not a distributed
// attack (that is the host's firewall's job). Buckets expire on their own.
export function createLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  function live(key: string): Bucket | null {
    const bucket = buckets.get(key);
    if (!bucket) return null;
    if (bucket.resetAt <= Date.now()) {
      buckets.delete(key);
      return null;
    }
    return bucket;
  }

  return {
    blocked: (key: string) => (live(key)?.count ?? 0) >= limit,
    hit(key: string) {
      const bucket = live(key);
      if (bucket) bucket.count += 1;
      else buckets.set(key, { count: 1, resetAt: Date.now() + windowMs });
      if (buckets.size > 5000) for (const k of buckets.keys()) live(k);
    },
    clear: (key: string) => void buckets.delete(key),
  };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
