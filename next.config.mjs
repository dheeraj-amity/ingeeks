/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const enableAnalyzer = process.env.ANALYZE === 'true';

// Base config adjusted for GitHub Pages static export
const base = {
  output: 'export',
  images: { unoptimized: true },
};

const nextConfig = enableAnalyzer ? withBundleAnalyzer({ enabled: true })(base) : base;
export default nextConfig;
