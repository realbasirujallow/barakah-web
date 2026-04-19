import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
// ── Bundle analyzer ─────────────────────────────────────────────────────────
// Activated only when ANALYZE=true is set (e.g. `npm run analyze`). Produces
// an interactive treemap of client/server chunks in .next/analyze/. Keeps
// production builds fast by no-op'ing in the common case.
import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// ── Environment validation ─────────────────────────────────────────────
// H-R4-2 fix (2026-04-18): fail the build if BACKEND_URL / NEXT_PUBLIC_API_URL
// is unset in a production build. The previous behaviour silently fell back
// to `https://api.trybarakah.com`, which hid real misconfigurations on
// preview / staging deploys and risked pointing a non-prod environment at
// the prod backend.
//
// Railway injects env vars at build time for production deploys, so if they
// are missing it IS a deployment bug — we want a loud failure, not a silent
// fallback. Local `npm run dev` keeps the old fallback so newcomers can run
// the web app without env scaffolding.
const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production';
const RAW_BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';

if (IS_PRODUCTION_BUILD && !RAW_BACKEND_URL) {
  throw new Error(
    'Configuration error: BACKEND_URL (or NEXT_PUBLIC_API_URL) must be set ' +
    'for production builds. Refusing to silently default to ' +
    'https://api.trybarakah.com — set the env var explicitly in Railway/Vercel.'
  );
}

// Backend URL used by the rewrite proxy. Explicit env var in production,
// fallback in dev so localhost workflows continue to work.
const BACKEND_URL = RAW_BACKEND_URL || 'https://api.trybarakah.com';

const isDev = process.env.NODE_ENV === "development";

// Plaid environment — only whitelist the host(s) we actually connect to.
// Production builds lock to production.plaid.com; dev builds permit the full
// set so engineers can switch between PLAID_ENV=sandbox / development without
// rebuilding the CSP.
const plaidHosts = isDev
  ? "https://production.plaid.com https://development.plaid.com https://sandbox.plaid.com"
  : "https://production.plaid.com";

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
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://cdn.plaid.com https://us-assets.i.posthog.com https://www.googletagmanager.com https://www.google-analytics.com`,
  // Styles: inline allowed (Tailwind + Recharts inject styles at runtime)
  "style-src 'self' 'unsafe-inline'",
  // Images: self + data URIs (chart gradients/icons) + blobs (PDF previews) + GA4
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  // Fonts: self only (no external font CDN used)
  "font-src 'self'",
  // Connections: backend proxy + PostHog analytics (proxied through /ingest) + GA4.
  // R5-L2 (2026-04-18): sources `BACKEND_URL` so that a preview/staging deploy
  // pointing at a non-prod API doesn't have its connect-src silently blocked
  // by a hardcoded `https://api.trybarakah.com`. Falls back to the prod host
  // in local dev for the exact same reason the proxy does.
  `connect-src 'self' ${BACKEND_URL} ${plaidHosts} https://us.i.posthog.com https://us-assets.i.posthog.com https://api.aladhan.com https://nominatim.openstreetmap.org https://www.google-analytics.com https://analytics.google.com`,
  // Allow Google Maps iframe embeds for property asset address visualization
  "frame-src 'self' https://cdn.plaid.com https://*.google.com https://*.googleapis.com https://*.gstatic.com",
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
      {
        // Public nisab calculator data can be cached briefly at the edge.
        source: "/api/zakat/info",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
      {
        // Apple App Site Association — iOS strictly requires
        // application/json for Universal Links to work. Without this header,
        // the file is served as octet-stream and iOS silently rejects it.
        // Apple also serves it from the bare /apple-app-site-association path
        // (legacy), so we route both. Cache short so a team-ID change can
        // propagate without a 24h CDN flush.
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
      {
        source: "/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // SEO consolidation: /learn/nisab is the canonical authority page.
      // /learn/nisab-threshold is the legacy slug kept alive only to preserve
      // existing backlinks. 301-permanent redirect tells Google (and all other
      // crawlers) to transfer ranking signals to the canonical URL.
      {
        source: "/learn/nisab-threshold",
        destination: "/learn/nisab",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return {
      // Proxy backend routes BEFORE Next.js page matching — eliminates CORS.
      beforeFiles: [
        { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
        // /auth/:path* is handled by Route Handler (src/app/auth/[...path]/route.ts)
        // instead of a rewrite, because rewrites strip Set-Cookie headers from
        // backend responses — breaking httpOnly auth_token / refresh_token cookies.
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
        // Apple App Site Association legacy path — Apple checks both
        // /.well-known/apple-app-site-association (preferred) and
        // /apple-app-site-association (legacy). Map the legacy path to the
        // canonical file in /public/.well-known so we keep one source of truth.
        {
          source: "/apple-app-site-association",
          destination: "/.well-known/apple-app-site-association",
        },
      ],
      fallback: [],
    };
  },
  // Required for PostHog reverse proxy
  skipTrailingSlashRedirect: true,
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
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

// Image optimization — Next.js serves optimized images automatically
// This acts as a built-in CDN with WebP conversion and lazy loading
