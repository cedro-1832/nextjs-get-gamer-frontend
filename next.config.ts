import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.api.playstation.com", "cdn.akamai.steamstatic.com"],
  },
};

export default nextConfig;
