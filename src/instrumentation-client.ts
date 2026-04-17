// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: "https://79fc028454d7ff7c469946c2f0270ee6@o4511159158636544.ingest.us.sentry.io/4511159161651200",

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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
