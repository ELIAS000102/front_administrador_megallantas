import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <--- OBLIGATORIO
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
