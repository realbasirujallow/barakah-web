'use client';
import React, { ReactNode, ErrorInfo } from 'react';
import { logError } from '../lib/logError';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Send to Sentry (no-op when NEXT_PUBLIC_SENTRY_DSN is unset)
    logError(error, {
      context: 'React error boundary',
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  handleRetry = () => {
    if (this.state.retryCount >= MAX_RETRIES) return; // force page reload instead
    this.setState(prev => ({ hasError: false, error: null, retryCount: prev.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      const exhausted = this.state.retryCount >= MAX_RETRIES;
      return (
        <div className="flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md w-full border border-red-100">
            <div className="text-center">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 mb-4">
                {exhausted
                  ? 'This page keeps running into an error. Please reload the page.'
                  : 'An unexpected error occurred. Please try again.'}
              </p>
              {this.state.error && (
                <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded break-words">
                  {this.state.error.message}
                </p>
              )}
              {exhausted ? (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
                >
                  Reload Page
                </button>
              ) : (
                <button
                  onClick={this.handleRetry}
                  className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
