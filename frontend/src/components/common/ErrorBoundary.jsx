import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error Boundary Exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          padding: '2rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '480px',
            padding: '2.5rem',
            textAlign: 'center',
            border: '1px solid var(--secondary)'
          }}>
            <FaExclamationTriangle size={48} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Unexpected Application Error
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred. Please refresh the page.'}
            </p>
            <button className="btn btn-primary" onClick={this.handleReload} style={{ width: '100%' }}>
              <FaRedo /> Reload Mess Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
