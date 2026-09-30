import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { absoluteUrl, productPath } from "@/lib/seo";
import { lookbook } from "@/lib/site";

export const revalidate = 60;

// /rayan is deliberately absent: it is noindex and should not be advertised.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
      images: lookbook.map((look) => absoluteUrl(look.src)),
    },
    { url: absoluteUrl("/shop"), changeFrequency: "weekly", priority: 0.9 },
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [product.mainImage, product.hoverImage]
        .filter((src): src is string => Boolean(src))
        .map(absoluteUrl),
    })),
  ];
}
