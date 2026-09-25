import type { Metadata } from "next";

// noindex only — never list /rayan in robots.txt, that would advertise it.
export const metadata: Metadata = {
  title: "Control room",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RayanLayout({ children }: LayoutProps<"/rayan">) {
  return <div className="min-h-svh bg-ink">{children}</div>;
}
