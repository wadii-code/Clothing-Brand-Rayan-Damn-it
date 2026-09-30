"use client";

import { Star } from "@/components/ui/star";

export default function StoreError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <Star className="size-16 text-blood" />
      <h1 className="mt-8 font-display text-6xl uppercase md:text-8xl">Well. It broke.</h1>
      <p className="mt-4 max-w-md text-sm text-white/55">
        We couldn&apos;t load the shop right now. Give it another shot.
        {error.digest && <span className="mt-2 block font-mono text-xs text-white/30">ref {error.digest}</span>}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-10 bg-blood px-8 py-4 font-display text-lg uppercase tracking-wider transition-colors hover:bg-white hover:text-black"
      >
        Try again
      </button>
    </section>
  );
}
