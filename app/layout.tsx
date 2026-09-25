import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} — Underground Streetwear`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Underground Streetwear`,
    description: site.description,
    images: [{ url: "/products/lookbook-hoodie.jpg", width: 2400, height: 1090 }],
  },
  twitter: { card: "summary_large_image" },
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
