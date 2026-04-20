// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';

// DSN is REQUIRED via NEXT_PUBLIC_SENTRY_DSN. No hardcoded fallback: if the
// env var is missing, Sentry stays un-initialized (better than silently
// shipping staging / preview errors into the production project).
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // 10% trace sampling in production. Edge runs middleware — capping prevents
    // one high-traffic path from saturating Sentry quota.
    tracesSampleRate: isProd ? 0.1 : 1.0,

    enableLogs: true,

    // PII off by default — see instrumentation-client.ts.
    sendDefaultPii: false,
  });
} else if (isProd) {
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN is not set — edge-runtime errors will not be reported.');
}
