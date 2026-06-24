import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Emit as a static file (required under output: "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
