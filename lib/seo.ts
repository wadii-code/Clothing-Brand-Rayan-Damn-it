import type { Metadata } from "next";
import { site } from "./site";
import type { Product } from "./types";

// Production must set NEXT_PUBLIC_SITE_URL to the https domain; on Vercel the production URL is the fallback.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

// Leaves absolute URLs (e.g. Supabase storage) untouched.
export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${siteUrl}/`).toString();
}

export const defaultOgImage = {
  url: "/products/lookbook-hoodie.jpg",
  width: 2400,
  height: 1090,
  alt: `${site.name} — ${site.tagline}`,
};

type OgImages = NonNullable<Metadata["openGraph"]>["images"];

// A page's openGraph replaces the layout's entirely, so every page sends the full set.
export function pageSeo({
  title,
  description,
  path,
  images = [defaultOgImage],
}: {
  title: string;
  description: string;
  path: string;
  images?: OgImages;
}): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_US", url: path, title, description, images },
  };
}

export const productPath = (product: Pick<Product, "slug">) => `/product/${product.slug}`;

export function organizationJsonLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.png"),
        image: absoluteUrl(defaultOgImage.url),
        description: site.description,
        slogan: site.tagline,
        areaServed: { "@type": "Country", name: "Morocco" },
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: absoluteUrl("/"),
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(productPath(product));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description ?? undefined,
    image: [product.mainImage, product.hoverImage].filter((src): src is string => Boolean(src)).map(absoluteUrl),
    category: product.category,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

export function productListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(productPath(product)),
      name: product.name,
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
