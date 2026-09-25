import Link from "next/link";
import { CodSteps } from "@/components/home/cod-steps";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { Hero } from "@/components/home/hero";
import { Lookbook } from "@/components/home/lookbook";
import { Manifesto } from "@/components/home/manifesto";
import { Marquee } from "@/components/home/marquee";
import { LockedCard, ProductCard } from "@/components/product/product-card";
import { Arrow } from "@/components/ui/arrow";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const revalidate = 60;

const GRID_SLOTS = 4;

export default async function HomePage() {
  const products = await getProducts();
  const lockedSlots = Math.max(0, GRID_SLOTS - products.length);

  return (
    <>
      <Hero />
      <Marquee />

      <section className="mx-auto max-w-[1800px] px-4 pt-16 pb-28 md:px-8 md:pt-24 md:pb-36">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label-mono text-blood">({site.drop}) — {String(products.length).padStart(2, "0")} pieces</p>
            <h2 className="mt-4 font-display text-6xl uppercase leading-[0.88] md:text-8xl">The drop</h2>
          </div>
          <Link href="/shop" className="group mb-2 flex items-center gap-2 label-mono text-white/70 hover:text-white">
            View all
            <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} sizes="(min-width: 1024px) 25vw, 50vw" />
          ))}
          {Array.from({ length: lockedSlots }, (_, i) => (
            <LockedCard key={i} index={products.length + i} />
          ))}
        </div>
      </section>

      <FeaturedSlider products={products} />
      <Manifesto />
      <Lookbook />
      <CodSteps />
    </>
  );
}
