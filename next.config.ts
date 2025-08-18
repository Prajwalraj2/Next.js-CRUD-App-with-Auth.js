import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // ← skip lint in `next build`
  },
  
};

export default nextConfig;
