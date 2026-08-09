const path = require('path');

// Derive the API host (for next/image) from the public API URL so images the
// API serves at /uploads/* render through next/image on the storefront.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
let apiImagePattern = null;
try {
  const u = new URL(apiUrl);
  apiImagePattern = { protocol: u.protocol.replace(':', ''), hostname: u.hostname };
} catch {
  apiImagePattern = null;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output for a slim Docker runtime image.
  output: 'standalone',
  transpilePackages: ['@srm-bats/ui', '@srm-bats/types'],
  // Monorepo: trace workspace deps from the repo root into the standalone bundle.
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgix.net',
      },
      // API host (derived from NEXT_PUBLIC_API_URL) for /uploads images.
      ...(apiImagePattern ? [apiImagePattern] : []),
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression
  compress: true,

  // Configure headers for caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
};

module.exports = nextConfig;
