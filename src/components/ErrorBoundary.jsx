import React from 'react';

// ---------------------------------------------------------------------------
// ChatErrorBoundary
// Wraps HeroChat. On error it shows a small friendly message inside the chat
// area only — the rest of the page is always preserved.
// ---------------------------------------------------------------------------
export class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ChatErrorBoundary] Chat component error:', error, info);
    // Safety: always restore body scroll in case the chat had locked it
    try {
      document.body.style.overflow = '';
    } catch {
      // ignore
    }
  }

  handleReset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="hero-chat-eb-fallback" role="alert">
          <p className="hero-chat-eb-text">
            The assistant hit a problem. Please try again.
          </p>
          <button
            type="button"
            className="hero-chat-retry-btn"
            onClick={this.handleReset}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// AppErrorBoundary
// Top-level last-resort safety net. Shows a simple reload fallback instead
// of a totally blank page if something catastrophic happens outside the chat.
// ---------------------------------------------------------------------------
export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary] Uncaught app error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            gap: '1rem',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            color: '#e2e8f0',
            background: '#0a0a0a',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            An unexpected error occurred. Please reload the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
