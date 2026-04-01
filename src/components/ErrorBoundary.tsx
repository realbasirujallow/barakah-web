import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md w-full border border-red-100">
            <div className="text-center">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 mb-4">
                An unexpected error occurred. Please try again.
              </p>
              {this.state.error && (
                <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded break-words">
                  {this.state.error.message}
                </p>
              )}
              <button
                onClick={this.handleRetry}
                className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
