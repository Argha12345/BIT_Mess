import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaIdCard, FaBuilding, FaUtensils } from 'react-icons/fa';
import { api } from '../utils/api';

export default function Profile({ user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPwdError('All password fields are required.');
    }

    if (newPassword.length < 6) {
      return setPwdError('New password must be at least 6 characters long.');
    }

    if (newPassword !== confirmPassword) {
      return setPwdError('New password and confirm password do not match.');
    }

    setIsLoading(true);
    try {
      const res = await api.auth.changePassword({ currentPassword, newPassword });
      setPwdSuccess(res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.message || 'Failed to update password. Verify your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '1.5rem',
          boxShadow: 'var(--shadow-primary-glow)'
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-title)', margin: 0 }}>
            {user.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            {user.rollNo} • <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>{user.role.toUpperCase()}</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Profile Information Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaIdCard style={{ color: 'var(--primary)' }} /> Account Details & Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Full Name</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Email Address / Roll No</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{user.rollNo}</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Hostel Block</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <FaBuilding style={{ color: 'var(--primary)' }} /> {user.hostel}
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Mess Section</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.section} Mess Section</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaLock style={{ color: 'var(--primary)' }} /> Account Security & Change Password
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Update your account password. New password must be at least 6 characters.
          </p>

          {pwdError && (
            <div className="auth-alert error-alert" style={{ marginBottom: 0 }}>
              <FaShieldAlt size={16} />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="auth-alert success-alert" style={{ marginBottom: 0 }}>
              <FaCheckCircle size={16} />
              <span>{pwdSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                >
                  {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPw(!showNewPw)}
                >
                  {showNewPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {isLoading ? <span className="spinner" style={{ margin: '0 auto' }} /> : 'Update Account Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
