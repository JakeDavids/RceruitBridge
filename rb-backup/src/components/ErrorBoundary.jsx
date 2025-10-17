import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Suppress MetaMask and crypto wallet errors
    if (error?.message?.includes('MetaMask') || 
        error?.message?.includes('ethereum') ||
        error?.message?.includes('wallet') ||
        error?.message?.includes('Web3')) {
      console.warn('Suppressed wallet extension error:', error.message);
      return { hasError: false }; // Don't show error UI
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ignore wallet extension errors
    if (error?.message?.includes('MetaMask') || 
        error?.message?.includes('ethereum') ||
        error?.message?.includes('wallet') ||
        error?.message?.includes('Web3')) {
      return;
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6">Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handlers - suppress wallet extension spam
if (typeof window !== 'undefined') {
  // Suppress unhandled promise rejections from wallet extensions
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason);
    if (reason.includes('MetaMask') || 
        reason.includes('ethereum') || 
        reason.includes('wallet') ||
        reason.includes('Web3') ||
        reason.includes('crypto')) {
      console.warn('Suppressed wallet promise rejection');
      event.preventDefault();
    }
  });

  // Suppress console errors from wallet extensions
  const originalError = console.error;
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    if (errorMessage.includes('MetaMask') || 
        errorMessage.includes('ethereum') || 
        errorMessage.includes('wallet') ||
        errorMessage.includes('Web3') ||
        errorMessage.includes('crypto') ||
        errorMessage.includes('Failed to connect')) {
      return; // Silently ignore
    }
    originalError.apply(console, args);
  };

  // Prevent MetaMask from trying to auto-connect
  Object.defineProperty(window, 'ethereum', {
    get() {
      return undefined; // Hide ethereum object from wallet extensions
    },
    set() {
      // Do nothing - prevent wallet extensions from setting window.ethereum
    },
    configurable: true
  });
}

export default ErrorBoundary;