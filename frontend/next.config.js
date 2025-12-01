/** @type {import('next').NextConfig} */
const API_PROXY_TARGET =
  (process.env.NEXT_PUBLIC_API_BASE || process.env.BACKEND_URL || "").replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!API_PROXY_TARGET) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
