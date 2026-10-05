import type { Metadata } from "next";
import Link from "next/link";
import { CodSteps } from "@/components/home/cod-steps";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { Hero } from "@/components/home/hero";
import { Lookbook } from "@/components/home/lookbook";
import { Manifesto } from "@/components/home/manifesto";
import { Marquee } from "@/components/home/marquee";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product/product-card";
import { Arrow } from "@/components/ui/arrow";
import { isPack } from "@/lib/pack";
import { getProducts } from "@/lib/products";
import { organizationJsonLd, pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageSeo({
  title: `${site.name} — Underground Streetwear`,
  description: site.description,
  path: "/",
});

export default async function HomePage() {
  const products = await getProducts();

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

        {/* items-end: the gift countdown above the pack card sits in the gap, so every image lines up. */}
        <div className="mt-12 grid grid-cols-2 items-end gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6">
          {products.map((product, i) => {
            const pack = isPack(product);
            return (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                className={pack ? "col-span-2 md:col-span-1" : undefined}
                sizes={pack ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
              />
            );
          })}
        </div>
      </section>

      <FeaturedSlider products={products} />
      <Manifesto />
      <Lookbook />
      <CodSteps />
      <JsonLd data={organizationJsonLd()} />
    </>
  );
}
