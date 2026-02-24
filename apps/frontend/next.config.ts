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
    const adminOrigin = process.env.NODE_ENV === 'production'
      ? 'https://nextcar-83e67.web.app'
      : 'http://localhost:5174';

    return [
      {
        source: '/admin/:path*',
        destination: `${adminOrigin}/:path*`,
        permanent: false,
      },
      {
        source: '/vehicles',
        destination: `${adminOrigin}/vehicles`,
        permanent: false,
      },
      {
        source: '/admin',
        destination: `${adminOrigin}/`,
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
