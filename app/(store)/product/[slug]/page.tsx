import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Star } from "@/components/ui/star";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${formatPrice(product.price)}. Cash on delivery.`,
    openGraph: { images: [product.mainImage] },
  };
}

const DETAILS = [
  {
    title: "Payment",
    body: "Cash on delivery only. No card, no account. You pay the courier when the package is in your hands.",
  },
  {
    title: "Delivery",
    body: "After you order we call you to confirm your size and address, then your piece ships straight to your door.",
  },
  {
    title: "Fit",
    body: "Cut oversized on purpose. Between two sizes? Take the smaller one for a cleaner silhouette, the larger one for a heavier drape.",
  },
];

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 4);
  const images = [product.mainImage, product.hoverImage].filter((src): src is string => Boolean(src));

  return (
    <>
      <section className="mx-auto grid max-w-[1800px] gap-10 px-4 pt-24 pb-24 md:grid-cols-12 md:gap-12 md:px-8 md:pt-28">
        <div className="md:col-span-7">
          <ProductGallery images={images} name={product.name} />
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 label-mono text-white/40">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-white">Shop</Link>
              <span>/</span>
              <span className="text-white/70">{product.category}</span>
            </nav>

            <h1 className="mt-6 font-display text-6xl uppercase leading-[0.9] md:text-7xl">{product.name}</h1>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-display text-4xl text-blood">{formatPrice(product.price)}</span>
              <span className="flex items-center gap-2 border border-white/15 px-2 py-1 label-mono text-white/60">
                <Star className="size-2.5 text-blood" /> {site.drop}
              </span>
            </div>
            {product.description && (
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/60">{product.description}</p>
            )}

            <ProductPurchase product={product} />

            <div className="mt-10 border-t border-white/10">
              {DETAILS.map((detail) => (
                <details key={detail.title} className="group border-b border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-display text-xl uppercase tracking-wide [&::-webkit-details-marker]:hidden">
                    {detail.title}
                    <span className="relative size-3">
                      <span className="absolute top-1/2 left-0 h-px w-3 bg-white" />
                      <span className="absolute top-1/2 left-0 h-px w-3 rotate-90 bg-white transition-transform duration-300 group-open:rotate-0" />
                    </span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-white/55">{detail.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1800px] border-t border-white/10 px-4 py-24 md:px-8">
          <h2 className="font-display text-5xl uppercase md:text-7xl">
            Complete <span className="text-outline">the fit</span>
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} sizes="(min-width: 1024px) 25vw, 50vw" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
