import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16+)
  turbopack: {},

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
    // Allow unoptimized images for development
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard/employer/:path*',
        has: [
          {
            type: 'cookie',
            key: 'role',
            value: 'SEEKER',
          },
        ],
        destination: '/dashboard/seeker',
        permanent: false,
      },
    ];
  },

  // Enable experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Output configuration for deployment
  output: 'standalone',

  // Powered by header
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
