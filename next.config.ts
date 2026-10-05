import type { NextConfig } from "next";

// Files in /public keep their names when replaced, so cache for a day and revalidate in the background.
const publicAssetCache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };

// Next.js streams page data in inline scripts and framer-motion animates through inline styles, so both
// need 'unsafe-inline' (nonces would force every page to render per request). Everything else is locked
// to this origin. Production only: the dev server relies on eval and websockets.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Explicit: never ship source maps to browsers in production, they would expose the full source.
  productionBrowserSourceMaps: false,
  // No `experimental` block: Next prints every non-default experiment on startup. Its disk cache is on
  // (the default, faster restarts; delete .next to reclaim the space), and framer-motion needs no
  // optimizePackageImports since it is marked side-effect free and tree-shakes on its own.
  // An unrelated package-lock.json in the home folder confuses root detection.
  turbopack: { root: __dirname },
  images: {
    // AVIF where the browser supports it (~20% smaller than WebP), WebP otherwise.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // Products were renamed: old links (shared, bookmarked, indexed by Google) land on the new pages.
  async redirects() {
    return [
      { source: "/product/solar-sigil-hoodie", destination: "/product/red-hoodie", permanent: true },
      { source: "/product/northstar-baggy-jeans", destination: "/product/red-pants", permanent: true },
      { source: "/product/full-fit-pack", destination: "/product/red-pack", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Browsers ignore HSTS over plain http, so this is inert on localhost.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
        ],
      },
      { source: "/products/:path*", headers: [publicAssetCache] },
      { source: "/brand/:path*", headers: [publicAssetCache] },
    ];
  },
};

export default nextConfig;
