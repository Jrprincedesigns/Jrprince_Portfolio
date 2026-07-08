import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { caseOrder } from "@/data/caseStudyContent";

/**
 * Sitemap for www.jrprince.design. Mirrors the routes Next pre-renders:
 * the home page, /about, and every case study in `caseOrder`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const lastModified = new Date();

  const staticRoutes = ["", "/about"];
  const workRoutes = caseOrder.map((slug) => `/work/${slug}`);

  return [...staticRoutes, ...workRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
