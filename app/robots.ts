import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Never list /rayan here — that would advertise it. It is kept out of search with noindex instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
