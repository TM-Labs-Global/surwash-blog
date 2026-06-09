import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/newsletter/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

