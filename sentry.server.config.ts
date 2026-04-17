// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: "https://79fc028454d7ff7c469946c2f0270ee6@o4511159158636544.ingest.us.sentry.io/4511159161651200",

  // 10% trace sampling in production to cap Sentry cost on a financial backend.
  tracesSampleRate: isProd ? 0.1 : 1.0,

  enableLogs: true,

  // PII off by default — see instrumentation-client.ts for the rationale.
  sendDefaultPii: false,
});
