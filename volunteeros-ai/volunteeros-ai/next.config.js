/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Running `npm run dev:admin` (port 3000) and `npm run dev:portal` (port 3001)
  // at the same time works better with separate build caches.
  distDir: process.env.PORT === "3001" ? ".next-portal" : ".next",
};

module.exports = nextConfig;
