import type { NextConfig } from "next";

// Backend URL used by the rewrite proxy. Set BACKEND_URL (server-side) or
// NEXT_PUBLIC_API_URL to point to your Spring Boot backend.
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.trybarakah.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Proxy backend routes BEFORE Next.js page matching — eliminates CORS.
      beforeFiles: [
        { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
        { source: "/auth/:path*", destination: `${BACKEND_URL}/auth/:path*` },
        { source: "/admin/:path*", destination: `${BACKEND_URL}/admin/:path*` },
        { source: "/health", destination: `${BACKEND_URL}/health` },
      ],
      afterFiles: [
        // PostHog reverse proxy
        {
          source: "/ingest/static/:path*",
          destination: "https://us-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://us.i.posthog.com/:path*",
        },
      ],
      fallback: [],
    };
  },
  // Required for PostHog reverse proxy
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
