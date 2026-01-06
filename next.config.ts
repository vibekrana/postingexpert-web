//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // If you use next/image anywhere, S3 can't run the image optimizer.
  images: {
    unoptimized: true,
  },

  // Optional but helpful: trailingSlash makes exports map cleanly to folders on S3
  trailingSlash: true,
};

export default nextConfig;
