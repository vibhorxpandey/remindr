import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `next lint` is deprecated in 15.5 and its internal runner is incompatible
  // with our ESLint 9 flat config. We lint via the ESLint CLI (`npm run lint`).
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Remote patterns for gallery/CDN imagery can be added here later.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
