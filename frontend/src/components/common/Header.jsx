import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaRegBell, FaSun, FaMoon, FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { useNotifications } from '../../hooks/useNotifications';

export default function Header({ user, pageTitle, networkStatus }) {
  const {
    notifications,
    unreadCount,
    showNotifications,
    toggleNotifications,
    clearNotifications
  } = useNotifications(user);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--border-glass)',
      position: 'relative'
    }}>
      <div>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: 'var(--primary)', 
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          display: 'block',
          marginBottom: '0.25rem'
        }}>
          Bannari Amman Institute of Technology
        </span>
        <h1 style={{ 
          fontFamily: 'var(--font-title)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px'
        }}>
          {pageTitle}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        


        <div style={{
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--border-glass)',
          borderRadius: '30px',
          padding: '0.45rem 1.2rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          boxShadow: 'var(--shadow-glass-sm)'
        }}>
          {today}
        </div>

        <button
          className="btn btn-secondary"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Glass Mode`}
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'var(--border-glass)'
          }}
        >
          {theme === 'light' ? (
            <FaMoon size={16} style={{ color: '#0052d4' }} />
          ) : (
            <FaSun size={16} style={{ color: '#fde047' }} />
          )}
        </button>

        {user && user.section !== 'All' && (
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              onClick={toggleNotifications}
              style={{ 
                padding: '0.5rem', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: showNotifications ? 'var(--primary)' : 'var(--border-glass)',
                boxShadow: showNotifications ? 'var(--shadow-primary-glow)' : 'none'
              }}
            >
              <FaRegBell size={16} style={{ color: showNotifications ? 'var(--primary)' : 'inherit' }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--primary-gradient)',
                  color: '#040914',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-primary-glow)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '320px',
                maxHeight: '380px',
                overflowY: 'auto',
                zIndex: 999,
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: '1px solid var(--border-glass-active)',
                boxShadow: 'var(--shadow-glass-card), 0 0 30px rgba(0, 210, 255, 0.2)',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-title)', margin: 0 }}>
                    Menu Notifications ({user?.section})
                  </h4>
                  <button 
                    onClick={clearNotifications} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Clear All
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    No new menu updates.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notifications.map(notif => (
                      <div 
                        key={notif.id}
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          lineHeight: '1.4'
                        }}
                      >
                        <p style={{ color: 'var(--text-primary)', margin: 0 }}>{notif.message}</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="badge badge-success" style={{ gap: '0.25rem', padding: '0.4rem 0.8rem' }}>
            <FaShieldAlt size={12} /> Admin Mode
          </div>
        )}
      </div>
    </header>
  );
}

