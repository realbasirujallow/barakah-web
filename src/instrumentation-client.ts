// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import posthog from 'posthog-js';

const isProd = process.env.NODE_ENV === 'production';

// --- PostHog ---------------------------------------------------------------
// Initialize PostHog HERE (client bootstrap, runs before the app renders) —
// NOT in a React provider/effect. The earlier provider-based inits ran after
// (or raced) hydration, so the initial `capture('$pageview')` fired before
// posthog finished init and posthog-js silently dropped it (Web Analytics
// showed 0 pageviews despite live traffic). With init here, posthog captures
// $pageview itself on initial load + every App Router navigation.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    // Prod uses the '/ingest' reverse-proxy (next.config rewrites → us.i.posthog.com).
    // NEXT_PUBLIC_POSTHOG_HOST lets the local proof point straight at PostHog
    // (the localhost proxy doesn't complete posthog's init); unset in prod.
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || 'https://us.posthog.com',
    person_profiles: 'identified_only',
    // `true` captures $pageview on the initial page load (full navigation);
    // posthog-js also tracks SPA navigations via the History API in this
    // version. ('history_change' alone fired only on history changes, NOT the
    // initial load, so full-page landings — the bulk of marketing traffic —
    // went uncounted.)
    capture_pageview: true,
    capture_pageleave: true,
  });
}
// ---------------------------------------------------------------------------

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
