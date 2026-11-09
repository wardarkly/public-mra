import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/mra',
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
