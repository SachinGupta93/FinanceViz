/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false, // Disable SWC minification to work around build issues
  poweredByHeader: false,
  reactStrictMode: false,
};

module.exports = nextConfig;
