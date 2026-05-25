import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="widget-error-fallback glass-panel" 
          style={{ 
            border: '1px solid rgba(255, 95, 86, 0.2)', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            background: 'rgba(20, 10, 10, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minHeight: '120px',
            justifyContent: 'center'
          }}
        >
          <h4 style={{ color: '#FF5F56', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <span role="img" aria-label="warning">⚠️</span> {this.props.title || "Widget Unavailable"}
          </h4>
          <p style={{ fontSize: '0.78rem', color: '#A0A0B0', margin: 0, lineHeight: 1.4 }}>
            {this.props.fallbackText || "Failed to load this component. Please refresh or try again later."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
