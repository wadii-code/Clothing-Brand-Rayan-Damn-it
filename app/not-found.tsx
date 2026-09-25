import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Image
        src="/brand/sigil.png"
        alt=""
        width={900}
        height={900}
        className="pointer-events-none absolute w-[min(120vw,900px)] animate-spin-slow opacity-10"
      />
      <p className="relative label-mono text-blood">Error 404</p>
      <h1 className="relative mt-4 font-display text-[26vw] leading-[0.8] md:text-[16vw]">
        DAMN<span className="text-outline-red">.</span>
      </h1>
      <p className="relative mt-6 max-w-sm text-sm uppercase text-white/55">Nothing here. Maybe it sold out. Maybe it never existed.</p>
      <Link
        href="/shop"
        className="relative mt-10 bg-blood px-8 py-4 font-display text-lg uppercase tracking-wider transition-colors hover:bg-white hover:text-black"
      >
        Back to the shop
      </Link>
    </main>
  );
}
