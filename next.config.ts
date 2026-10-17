import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets a production build run beside `npm run dev` without sharing its .next folder
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // This project's own folder is the root (a package-lock.json higher up confused detection)
  outputFileTracingRoot: process.cwd(),
  typescript: {
    // The codebase typechecks cleanly, so fail the build on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
