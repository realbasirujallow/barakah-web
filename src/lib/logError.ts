/**
 * Centralized error logging utility.
 *
 * To add Sentry later:
 *   1. npm install @sentry/nextjs
 *   2. Replace the console.error below with: Sentry.captureException(error, { extra: context })
 *   3. Follow Sentry Next.js setup docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

interface ErrorContext {
  digest?: string;
  userId?: string;
  [key: string]: unknown;
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

  // TODO: Swap this for a real monitoring service when ready, e.g.:
  // Sentry.captureException(error, { extra: context });
  // Or send to your own logging endpoint:
  // fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ message, digest, ...context }) });
}
