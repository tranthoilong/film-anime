import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        serverComponentsExternalPackages: ['knex'],
        optimizeCss: false,
    },
};

export default nextConfig;
