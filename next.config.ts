import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['scribe.js-ocr'],
  experimental: {
    ppr: true,
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
