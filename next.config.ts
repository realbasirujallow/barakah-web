import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// ── Environment validation ─────────────────────────────────────────────
// Warn (but don't crash) if BACKEND_URL is unset during the build step —
// Railway injects env vars at runtime, so the build image may not have
// them yet.  The fallback on line 18 (`https://api.trybarakah.com`) keeps
// the build working; the rewrites will resolve correctly at runtime once
// the var is injected.
if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_URL) {
  console.warn(
    '⚠️  BACKEND_URL is not set — falling back to https://api.trybarakah.com. ' +
    'Set BACKEND_URL in your deployment configuration for explicit control.'
  );
}

// Backend URL used by the rewrite proxy. Set BACKEND_URL (server-side) or
// NEXT_PUBLIC_API_URL to point to your Spring Boot backend.
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.trybarakah.com";

const isDev = process.env.NODE_ENV === "development";

// ── Content Security Policy ────────────────────────────────────────────────
// Protects against XSS, clickjacking, and data-injection attacks.
//
// Why each directive:
//   script-src  'unsafe-inline'  — required by Next.js App Router hydration
//   script-src  'unsafe-eval'    — dev only (webpack HMR); stripped in production
//   style-src   'unsafe-inline'  — required by Tailwind CSS & Recharts
//   connect-src /ingest/**       — PostHog reverse-proxied through Next.js
//   frame-ancestors 'none'       — equivalent to X-Frame-Options: DENY
//   upgrade-insecure-requests    — forces all sub-resources to HTTPS
const csp = [
  "default-src 'self'",
  // Scripts: self + inline (hydration) + PostHog loader + GA4 + dev eval
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://us-assets.i.posthog.com https://www.googletagmanager.com https://www.google-analytics.com`,
  // Styles: inline allowed (Tailwind + Recharts inject styles at runtime)
  "style-src 'self' 'unsafe-inline'",
  // Images: self + data URIs (chart gradients/icons) + blobs (PDF previews) + GA4
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  // Fonts: self only (no external font CDN used)
  "font-src 'self'",
  // Connections: backend proxy + PostHog analytics (proxied through /ingest) + GA4
  "connect-src 'self' https://api.trybarakah.com https://us.i.posthog.com https://us-assets.i.posthog.com https://api.aladhan.com https://www.google-analytics.com https://analytics.google.com",
  // Allow Google Maps iframe embeds for property asset address visualization
  "frame-src 'self' https://*.google.com https://*.googleapis.com https://*.gstatic.com",
  // No plugins (Flash, Silverlight, etc.)
  "object-src 'none'",
  // Prevent base-tag injection attacks
  "base-uri 'self'",
  // Forms must submit to same origin
  "form-action 'self'",
  // Disallow embedding in iframes anywhere — clickjacking protection
  "frame-ancestors 'none'",
  // Force all sub-resource requests to HTTPS
  "upgrade-insecure-requests",
]
  .join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  // HSTS: force HTTPS for 1 year, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Belt-and-suspenders clickjacking protection (respected by older browsers
  // that don't support frame-ancestors)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME-type sniffing (already set by Spring Boot for API responses)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Only send origin when navigating to HTTPS, nothing on HTTP downgrade
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Allow camera/mic only if the user explicitly grants permission;
  // geolocation allowed for prayer-times page (requires self permission)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // Compress responses (gzip/brotli) — reduces payload by ~70%
  compress: true,

  async headers() {
    return [
      {
        // Apply security headers to every route served by Next.js
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Cache static assets (JS, CSS, fonts, images) for 1 year
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache API price/nisab calls at CDN level for 5 minutes to reduce backend load
        source: "/api/prices/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
    ];
  },

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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "barakah-islamic-finance",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Don't fail the build if SENTRY_AUTH_TOKEN is missing (source maps
  // just won't be uploaded). This prevents deploy failures on Railway
  // when the token isn't configured.
  errorHandler: (err) => {
    console.warn('Sentry source map upload warning:', err.message);
  },

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
