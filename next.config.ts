import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Allow preview panel cross-origin requests
  allowedDevOrigins: [
    '.space-z.ai',
  ],
};

export default nextConfig;
