import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const enableSentrySourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

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
      // Default root to Latvian locale
      {
        source: '/',
        destination: '/lv',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: `${adminOrigin}/:path*`,
        permanent: false,
      },
      {
        source: '/admin',
        destination: `${adminOrigin}/`,
        permanent: false,
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: process.env.SENTRY_RELEASE
    ? {
        name: process.env.SENTRY_RELEASE,
      }
    : undefined,
  sourcemaps: {
    disable: !enableSentrySourceMaps,
  },
});
