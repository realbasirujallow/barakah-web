'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, send errors to your monitoring service (e.g. Sentry, PostHog).
    // For now, log to console — replace with a proper error tracker when available.
    if (process.env.NODE_ENV === 'production') {
      // TODO: Replace with Sentry.captureException(error) or similar
      // Avoid logging full stack traces in production console
      console.error('Unhandled error:', error.message, error.digest ?? '');
    } else {
      console.error('Unhandled error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
