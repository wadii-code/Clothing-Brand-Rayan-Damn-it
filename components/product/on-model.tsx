import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { modelShots } from "@/lib/site";
import { Arrow } from "../ui/arrow";

export function OnModel({ products }: { products: Product[] }) {
  const slugs = new Set(products.map((product) => product.slug));

  return (
    <section aria-labelledby="on-model-heading" className="mt-28 border-t border-white/10 pt-16 md:mt-36 md:pt-24">
      <p className="label-mono text-blood">Shop the look</p>
      <h2 id="on-model-heading" className="mt-4 font-display text-5xl uppercase leading-[0.88] md:text-7xl">
        Worn <span className="text-outline">on model</span>
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-3 md:gap-x-6">
        {modelShots.map((shot) => {
          const linked = slugs.has(shot.slug);
          const content = (
            <>
              <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 label-mono text-white/50">
                <span>{shot.caption}</span>
                {linked && (
                  <Arrow className="size-4 shrink-0 -translate-x-2 text-blood opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                )}
              </figcaption>
            </>
          );

          return (
            <figure key={shot.src + shot.slug} className="group">
              {linked ? (
                <Link href={`/product/${shot.slug}`} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
