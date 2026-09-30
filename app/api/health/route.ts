export const dynamic = "force-dynamic";

// For uptime monitors (Better Stack, UptimeRobot…): a 200 here means the server is up and responding.
export function GET() {
  return Response.json(
    { status: "ok", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
