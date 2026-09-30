import { formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { absoluteUrl, productPath } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 60;

// https://llmstxt.org — a plain-markdown summary of the store for AI assistants and crawlers.
export async function GET() {
  const products = await getProducts();

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.tagline}. Current collection: ${site.drop} (${site.season}). Prices are in Moroccan dirham (DH / MAD).`,
    "",
    "## Pages",
    "",
    `- [Home](${absoluteUrl("/")}): the current drop, lookbook and how cash on delivery works`,
    `- [Shop](${absoluteUrl("/shop")}): every piece, filterable by category`,
    "",
    "## Products",
    "",
    ...products.map((product) => {
      const sizes = product.sizes.length > 0 ? `sizes ${product.sizes.join(", ")}` : "one size";
      const details = product.description ? ` ${product.description}` : "";
      return `- [${product.name}](${absoluteUrl(productPath(product))}): ${formatPrice(product.price)}, ${product.category}, ${sizes}.${details}`;
    }),
    "",
    "## How ordering works",
    "",
    "- No account and no card: pick a piece and size, then enter full name, phone, city and exact address.",
    `- ${site.checkoutNote}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
