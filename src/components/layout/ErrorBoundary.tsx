import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-[70vh] flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="mb-12">
              <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
                <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  <span>APPLICATION ERROR</span>
                </span>
                <span className="text-white/30">/</span>
                <span className="text-white/60">UNHANDLED EXCEPTION</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] mb-6 break-words">
                SOMETHING <br />
                <span className="italic font-light text-[#FF3E00] tracking-tight lowercase">
                  went
                </span>{' '}
                <br />
                UNEXPECTED.
              </h1>

              <p className="max-w-xl text-lg text-muted-primary leading-relaxed mb-8">
                An isolated component error occurred during rendering. This is an application state exception, not a missing route.
              </p>

              {this.state.error && (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 max-w-2xl font-mono text-xs text-red-400 mb-8 overflow-x-auto">
                  <code>{this.state.error.message || 'Unknown runtime error'}</code>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={this.handleReset}
                  data-cursor="cta"
                  className="px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#FF3E00]/25 inline-flex items-center space-x-2"
                >
                  <RefreshCw size={14} />
                  <span>TRY AGAIN</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReload}
                  data-cursor="cta"
                  className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <span>RELOAD PAGE</span>
                </button>

                <a
                  href="/"
                  data-cursor="cta"
                  className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <span>HOME</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
