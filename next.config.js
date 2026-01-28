/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['profile.line-scdn.net'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
