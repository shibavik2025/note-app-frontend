import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, 
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
