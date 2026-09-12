import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // CRM (app/(admin), kernel/, entities/):
  // resvg ships a native binary per platform behind a `require` the bundler
  // cannot follow; as an external it loads from node_modules as intended.
  serverExternalPackages: ["@resvg/resvg-js"],
  experimental: {
    // Meeting transcript uploads arrive through server actions; the 1 MB
    // default silently rejected files the app itself allows up to 10 MB.
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
