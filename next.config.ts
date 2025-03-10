import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        fs: false, 
        path: false 
      };
    }
    return config;
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["image.api.playstation.com"],
  },
};

export default nextConfig;
