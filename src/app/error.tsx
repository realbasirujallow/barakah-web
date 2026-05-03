'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logError } from '../lib/logError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
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
