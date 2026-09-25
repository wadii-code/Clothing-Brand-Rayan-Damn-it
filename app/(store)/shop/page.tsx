import type { Metadata } from "next";
import { ShopGrid } from "@/components/product/shop-grid";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: `Every ${site.name} piece. Order online, pay cash on delivery.`,
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto min-h-svh max-w-[1800px] px-4 pt-32 pb-28 md:px-8 md:pt-40">
      <p className="label-mono text-blood">({site.drop}) — Cash on delivery</p>
      <h1 className="mt-4 font-display text-[22vw] uppercase leading-[0.8] md:text-[13vw]">
        The <span className="text-outline">archive</span>
      </h1>
      <ShopGrid products={products} />
    </section>
  );
}
