import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:5174/:path*',
        permanent: false,
      },
      {
        source: '/vehicles',
        destination: 'http://localhost:5174/vehicles',
        permanent: false,
      },
      {
        source: '/admin',
        destination: 'http://localhost:5174/',
        permanent: false,
      }
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: {
    disable: true,
  },
});
