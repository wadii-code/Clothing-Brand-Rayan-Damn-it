import { getGiftsLeft } from "@/lib/pack-gift";

export const dynamic = "force-dynamic";

// Polled by the pack countdown so open pages tick down as orders land.
export async function GET() {
  return Response.json({ left: await getGiftsLeft() }, { headers: { "Cache-Control": "no-store" } });
}
