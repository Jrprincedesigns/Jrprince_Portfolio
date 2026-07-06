/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add remote image hosts here as you wire up real assets, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
    remotePatterns: [],
  },
};

export default nextConfig;
