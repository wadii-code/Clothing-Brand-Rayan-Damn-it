import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { defaultOgImage, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted so builds don't depend on reaching Google Fonts.
const anton = localFont({
  src: "./fonts/anton-400.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});
const archivo = localFont({
  src: "./fonts/archivo-variable.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  display: "swap",
});
const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-variable.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — Underground Streetwear`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  category: "shopping",
  keywords: ["streetwear", "underground", "hoodies", "baggy jeans", "embroidered", "Morocco", "Maroc", "cash on delivery"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} — Underground Streetwear`,
    description: site.description,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image" },
  // Google Search Console → HTML tag method: put the content="…" value in GOOGLE_SITE_VERIFICATION.
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <body className="min-h-svh bg-ink text-bone antialiased">
        <Providers>{children}</Providers>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
