import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Collections are served on subdomains: glass.localhost:3002, tide.localhost:3002.
  allowedDevOrigins: ["*.localhost"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
