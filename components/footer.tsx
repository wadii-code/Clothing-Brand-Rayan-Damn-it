import Link from "next/link";
import { site } from "@/lib/site";
import { Star } from "./ui/star";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: "Instagram", href: site.social.instagram },
    { label: "TikTok", href: site.social.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-[1800px] gap-12 px-4 pt-16 md:grid-cols-12 md:px-8 md:pt-24">
        <div className="md:col-span-5">
          <p className="label-mono text-blood">{site.drop} — out now</p>
          <p className="mt-4 max-w-sm font-display text-4xl uppercase leading-[0.95] md:text-5xl">
            {site.tagline}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="label-mono text-white/40">Shop</p>
            <ul className="mt-4 space-y-2 text-sm uppercase">
              <li><Link href="/shop" className="hover:text-blood">All pieces</Link></li>
              <li><Link href="/#lookbook" className="hover:text-blood">Lookbook</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono text-white/40">Help</p>
            <ul className="mt-4 space-y-2 text-sm uppercase">
              <li><Link href="/#cod" className="hover:text-blood">Cash on delivery</Link></li>
              <li><Link href="/#cod" className="hover:text-blood">How to order</Link></li>
            </ul>
          </div>
          {socials.length > 0 && (
            <div>
              <p className="label-mono text-white/40">Follow</p>
              <ul className="mt-4 space-y-2 text-sm uppercase">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-blood">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div aria-hidden className="mt-16 flex select-none justify-center px-2 md:mt-24">
        {"DAMNIT".split("").map((letter, i) => (
          <span
            key={i}
            className="font-display text-[27vw] leading-[0.78] text-outline transition-[color,-webkit-text-stroke-color] duration-300 hover:text-blood hover:[-webkit-text-stroke-color:var(--color-blood)]"
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1800px] flex-col items-start justify-between gap-3 border-t border-white/10 px-4 py-6 label-mono text-white/40 sm:flex-row sm:items-center md:px-8">
        <span>© {year} {site.name}. All rights reserved.</span>
        <span className="flex items-center gap-2">
          <Star className="size-3 text-blood" /> Cash on delivery only
        </span>
      </div>
    </footer>
  );
}
