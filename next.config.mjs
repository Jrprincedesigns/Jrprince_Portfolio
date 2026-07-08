import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — a stray lockfile in the home dir otherwise makes
  // Next infer the wrong root (breaks output tracing on Vercel).
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [],
    // Prefer modern codecs and allow high-quality encodes for crisp UI mockups.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
