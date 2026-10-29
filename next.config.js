const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.VERCEL === "1") {
      return [{ source: "/api/:path+", destination: "/api/" }];
    }
    const backendUrl = (
      process.env.API_BACKEND_URL || "http://127.0.0.1:8000"
    ).replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

module.exports = nextConfig;
