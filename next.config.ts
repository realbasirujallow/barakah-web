import type { NextConfig } from "next";
<<<<<<< HEAD

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required for PostHog reverse proxy
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
=======
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" }
    ];
  }
};
export default nextConfig;
>>>>>>> faf68dff651cf5b2319c901df6151bd8ee75d9d2
