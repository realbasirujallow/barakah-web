// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';

// DSN falls back to the production project if NEXT_PUBLIC_SENTRY_DSN is not
// set. Override via environment so staging / preview builds do not pollute
// production error metrics.
const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://79fc028454d7ff7c469946c2f0270ee6@o4511159158636544.ingest.us.sentry.io/4511159161651200";

Sentry.init({
  dsn: SENTRY_DSN,

  // 10% trace sampling in production. Edge runs middleware — capping prevents
  // one high-traffic path from saturating Sentry quota.
  tracesSampleRate: isProd ? 0.1 : 1.0,

  enableLogs: true,

  // PII off by default — see instrumentation-client.ts.
  sendDefaultPii: false,
});
