import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
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

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Something went wrong</h1>
          <p className="text-navy/50 text-sm mb-8 font-medium max-w-xs">
            Pole sana — an unexpected error occurred. Your progress has been saved.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-navy text-white font-bold px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            <RefreshCw size={18} />
            Restart App
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 text-left text-xs text-red-600 bg-red-50 p-4 rounded-2xl max-w-full overflow-auto border border-red-200">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
