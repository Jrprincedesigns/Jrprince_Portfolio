import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** Allow all crawlers and point them at the sitemap on the custom domain. */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
