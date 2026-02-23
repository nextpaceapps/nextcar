import type { NextConfig } from "next";

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
        source: '/cars',
        destination: 'http://localhost:5174/cars',
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

export default nextConfig;
