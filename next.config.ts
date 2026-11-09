import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/:slug*.php',
        destination: '/:slug*',
        permanent: true,
      },
      {
        source: '/shortservice',
        destination: '/#services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
