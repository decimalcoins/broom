/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },

  // 👇 Tambahan supaya env terbaca di sisi client
  env: {
    NEXT_PUBLIC_PI_ENV: process.env.NEXT_PUBLIC_PI_ENV,
  },
};

module.exports = nextConfig;
