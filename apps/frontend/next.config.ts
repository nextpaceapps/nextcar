import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
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
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9199',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9199',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
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
        source: '/admin',
        destination: `${adminOrigin}/`,
        permanent: false,
      }
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
  sourcemaps: {
    disable: true,
  },
});
