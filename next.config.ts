import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images served from public/ (default) and future CDN
    remotePatterns: [],
  },
};

export default nextConfig;
