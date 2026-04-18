// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

    // 10% trace sampling in production to cap Sentry cost on a financial backend.
    tracesSampleRate: isProd ? 0.1 : 1.0,

    enableLogs: true,

    // PII off by default — see instrumentation-client.ts for the rationale.
    sendDefaultPii: false,
  });
} else if (isProd) {
  // eslint-disable-next-line no-console
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN is not set — server-side errors will not be reported.');
}
