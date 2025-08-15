/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const enableAnalyzer = process.env.ANALYZE === 'true';

const base = {
  images: {
    formats: ['image/avif','image/webp'],
  },
};

const nextConfig = enableAnalyzer ? withBundleAnalyzer({ enabled: true })(base) : base;
export default nextConfig;
