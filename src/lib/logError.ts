/**
 * Centralized error logging utility with optional Sentry integration.
 *
 * Setup:
 *   1. npm install @sentry/nextjs
 *   2. Set NEXT_PUBLIC_SENTRY_DSN in your .env
 *   3. Follow Sentry Next.js setup docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 *
 * When NEXT_PUBLIC_SENTRY_DSN is set, errors are automatically sent to Sentry.
 * When it's not set (local dev), errors only go to the browser console.
 */

interface ErrorContext {
  digest?: string;
  userId?: string;
  [key: string]: unknown;
}

// Lazy-load Sentry so the app still works without the package installed.
// Rather than `any`, we type the module to the structural subset we actually
// call — enough to catch typos on our side while not requiring @sentry/nextjs
// to be installed for compilation.
interface SentryModule {
  init(options: {
    dsn: string;
    environment?: string;
    tracesSampleRate?: number;
    replaysSessionSampleRate?: number;
    replaysOnErrorSampleRate?: number;
  }): void;
  captureException(error: Error, context?: { extra?: Record<string, unknown> }): void;
  captureMessage(message: string, context?: { extra?: Record<string, unknown> }): void;
  setUser(user: { id: string; email?: string } | null): void;
}

let Sentry: SentryModule | null = null;
let sentryInitAttempted = false;

async function getSentry() {
  if (sentryInitAttempted) return Sentry;
  sentryInitAttempted = true;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;

  try {
    // Use a variable so TypeScript can't statically resolve the module
    // (the package is optional and may not be installed)
    const sentryModule = '@sentry/nextjs';
    const loaded = (await import(sentryModule)) as SentryModule;
    // Only initialize if not already initialized (Sentry guards against double-init)
    loaded.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0, // Capture replay on every error
    });
    Sentry = loaded;
    return Sentry;
  } catch {
    // @sentry/nextjs not installed — that's fine, fall through to console logging
    return null;
  }
}

export function logError(error: Error | unknown, context?: ErrorContext): void {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Full stack trace in development
    console.error('[Barakah Error]', error, context ?? '');
    return;
  }

  // Production: log minimal info (no sensitive stack traces in browser console)
  const message = error instanceof Error ? error.message : String(error);
  const digest = context?.digest ?? '';
  console.error('[Barakah Error]', message, digest ? `(digest: ${digest})` : '');

  // Send to Sentry if configured
  getSentry().then((sentry) => {
    if (sentry) {
      if (error instanceof Error) {
        sentry.captureException(error, { extra: context });
      } else {
        sentry.captureMessage(message, { extra: context });
      }
    }
  }).catch(() => {
    // Sentry send failed — nothing more we can do
  });
}

/**
 * Set user context for Sentry (call after login).
 * Clears user context when called with null (call after logout).
 */
export function setErrorUser(user: { id: string; email?: string } | null): void {
  getSentry().then((sentry) => {
    if (sentry) {
      sentry.setUser(user ? { id: user.id, email: user.email } : null);
    }
  }).catch(() => {});
}
