import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Emit as a static file (required under output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/gallery", "/events", "/contact"];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
