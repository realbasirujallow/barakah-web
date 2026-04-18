'use client';
import React, { ReactNode, ErrorInfo } from 'react';
import { logError } from '../lib/logError';
import { t } from '../lib/i18n';

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
    // Send to Sentry (no-op when NEXT_PUBLIC_SENTRY_DSN is unset).
    //
    // Round 29: include `retryCount` so Sentry can distinguish first-time
    // errors (retryCount=0) from repeated failures within the same
    // session. A recurring error grouping at retryCount >= 2 is a strong
    // signal the problem is persistent (not a transient network blip) —
    // worth a higher alert threshold than a fresh error.
    logError(error, {
      context: 'React error boundary',
      componentStack: errorInfo.componentStack ?? undefined,
      retryCount: this.state.retryCount,
      exhausted: this.state.retryCount >= MAX_RETRIES,
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
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('errSomethingWentWrong')}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {exhausted ? t('errReloadMessage') : t('errTryAgainMessage')}
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
                  {t('errReloadPage')}
                </button>
              ) : (
                <button
                  onClick={this.handleRetry}
                  className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
                >
                  {t('errTryAgain')}
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
