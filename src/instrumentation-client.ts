// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';

// DSN is REQUIRED via NEXT_PUBLIC_SENTRY_DSN. There is intentionally no
// hardcoded fallback: a fallback to the production project would cause
// staging / preview / local-dev builds to pollute production error metrics
// when a deploy is misconfigured, and we want those misconfigurations to be
// visible (no Sentry) rather than silent (wrong Sentry project).
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Session Replay with default masking (text obscured, media blocked). PII is
    // explicitly disabled below, so Replay captures UX timing without leaking
    // balances, emails, or account details.
    integrations: [Sentry.replayIntegration()],

    // Sample 10% of transactions in production to keep Sentry bill predictable
    // on a financial dashboard where many users hit many pages. Full sampling in
    // dev so local work still surfaces perf regressions.
    tracesSampleRate: isProd ? 0.1 : 1.0,

    enableLogs: true,

    // Session replay — lower in production to avoid capturing more than we need.
    replaysSessionSampleRate: isProd ? 0.02 : 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Do NOT auto-capture PII. For a financial app this previously captured user
    // IPs, cookies, and form inputs by default — a GDPR/CCPA exposure.
    // Attach a scrubbed user id manually via Sentry.setUser({ id }) instead.
    sendDefaultPii: false,
  });
} else if (isProd && typeof window !== 'undefined') {
  // Loud warning in prod — deployments should always set this env var.
   
  console.warn('[Sentry] NEXT_PUBLIC_SENTRY_DSN is not set — client-side errors will not be reported.');
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
