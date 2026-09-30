import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ShopGrid } from "@/components/product/shop-grid";
import { getProducts } from "@/lib/products";
import { breadcrumbJsonLd, pageSeo, productListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 60;

const description = `Shop every ${site.name} piece from ${site.drop} — underground streetwear from Morocco. Order online, no card needed, pay cash on delivery.`;

export const metadata: Metadata = {
  title: "Shop",
  description,
  ...pageSeo({ title: `Shop — ${site.name}`, description, path: "/shop" }),
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto min-h-svh max-w-[1800px] px-4 pt-32 pb-28 md:px-8 md:pt-40">
      <p className="label-mono text-blood">({site.drop}) — Cash on delivery</p>
      <h1 className="mt-4 font-display text-[22vw] uppercase leading-[0.8] md:text-[13vw]">
        The <span className="text-outline">archive</span>
      </h1>
      <h2 className="sr-only">All pieces</h2>
      <ShopGrid products={products} />
      <JsonLd
        data={[
          productListJsonLd(products),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        ]}
      />
    </section>
  );
}
