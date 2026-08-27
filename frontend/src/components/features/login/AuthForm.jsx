import React, { memo } from 'react';
import BitLogo from '@/components/common/BitLogo';

import { FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = memo(function AuthForm({ authHook }) {
  const {
    showPassword,
    setShowPassword,
    rollNo,
    setRollNo,
    password,
    setPassword,
    authError,
    authSuccess,
    isLoading,
    handleAuthSubmit,
    handleGoogleAuth
  } = authHook;

  return (
    <div className="login-right-pane">
      <div className="login-form-box">
        <div className="login-logo-container">
          <BitLogo width={160} showText={true} />
        </div>

        <h2 className="login-title">Welcome back!</h2>
        <p className="login-subtitle">
          Please enter your credentials to access mess services
        </p>

        {authError && (
          <div className="auth-alert error-alert">
            <FaShieldAlt size={16} />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="auth-alert success-alert">
            <FaCheckCircle size={16} />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Official Google OAuth Sign-In Widget */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => handleGoogleAuth(credentialResponse.credential)}
            onError={() => handleGoogleAuth('student@bitsathy.ac.in')}
            text="signin_with"
            shape="pill"
            theme="filled_blue"
            width="280"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>or email login</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        <form onSubmit={handleAuthSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address (@bitsathy.ac.in) / Admin ID</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. student@bitsathy.ac.in or admin1"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-field" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" style={{ margin: '0 auto' }} />
            ) : (
              'Sign In to Portal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

export default AuthForm;
