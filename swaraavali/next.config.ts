import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=true produces a fully static build (`out/`) for GitHub Pages.
 * basePath is required because the project is served from the `/remindr`
 * sub-path of vibhorxpandey.github.io. When unset (local dev, or a future
 * Node/Vercel host for the Phase 2 backend), the app runs as a normal Next.js
 * server with Server Actions etc.
 */
const isExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `next lint` is deprecated in 15.5 and its internal runner is incompatible
  // with our ESLint 9 flat config. We lint via the ESLint CLI (`npm run lint`).
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Remote patterns for gallery/CDN imagery can be added here later.
    formats: ["image/avif", "image/webp"],
    // Static export can't use the on-demand optimizer.
    unoptimized: isExport,
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
  ...(isExport
    ? {
        output: "export" as const,
        trailingSlash: true, // GitHub Pages serves /route/ from route/index.html
        basePath,
        assetPrefix: basePath || undefined,
      }
    : {}),
};

export default nextConfig;
