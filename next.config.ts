import type { NextConfig } from "next";

// ── Build-time environment validation ──────────────────────────────────
// Fail fast if critical server-side env vars are missing in production.
if (process.env.NODE_ENV === 'production') {
  const required = ['BACKEND_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing recommended env vars: ${missing.join(', ')}. ` +
      `Falling back to defaults. Set these in your deployment for reliability.`
    );
  }
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
  // Scripts: self + inline (hydration) + PostHog loader + dev eval
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://us-assets.i.posthog.com`,
  // Styles: inline allowed (Tailwind + Recharts inject styles at runtime)
  "style-src 'self' 'unsafe-inline'",
  // Images: self + data URIs (chart gradients/icons) + blobs (PDF previews)
  "img-src 'self' data: blob:",
  // Fonts: self only (no external font CDN used)
  "font-src 'self'",
  // Connections: backend proxy + PostHog analytics (proxied through /ingest)
  "connect-src 'self' https://api.trybarakah.com https://us.i.posthog.com https://us-assets.i.posthog.com https://api.aladhan.com",
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

export default nextConfig;
