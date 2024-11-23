import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        serverComponentsExternalPackages: ['knex'],
        optimizeCss: false,
    },
    images: {
        domains: ['utfs.io']
    }
};

export default nextConfig;
