import React from 'react';
import BitLogo from './BitLogo';
import { 
  FaChartBar, 
  FaUser, 
  FaLock,
  FaMagic,
  FaIdCard,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Sidebar({ user, activePage, setActivePage, handleLogout, onOpenLoginModal }) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Live Dashboard', icon: FaChartBar, role: 'all' },
    { id: 'student-portal', label: 'Student Portal', icon: FaUser, role: 'student' },
    { id: 'admin-panel', label: 'Admin Console', icon: ShieldIcon(user), role: 'admin', locked: !user || user.role !== 'admin' },
    { id: 'profile', label: 'My Profile & Settings', icon: FaIdCard, role: 'authenticated' }
  ];

  function ShieldIcon(u) {
    return u?.role === 'admin' ? FaMagic : FaLock;
  }

  return (
    <aside className="sidebar">
      <div className="branding" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <BitLogo width={150} showText={true} />
        <div style={{ 
          fontSize: '0.7rem', 
          color: 'var(--text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          marginTop: '0.5rem',
          fontWeight: 700
        }}>
          Hostel Mess Analytics Hub
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map(item => {
          const isSelected = activePage === item.id;
          const isVisible = item.role === 'all' || 
                            (item.role === 'authenticated' && !!user) || 
                            (user && user.role === item.role);
          
          if (!isVisible) return null;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`btn`}
              style={{
                justifyContent: 'flex-start',
                backgroundColor: isSelected ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--border-glass-active)' : 'var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                boxShadow: isSelected ? 'var(--shadow-primary-glow)' : 'none'
              }}
            >
              <item.icon size={18} style={{ marginRight: '0.75rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
              {item.label}
              {item.locked && (
                <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
                  Admin
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div 
        className="glass-panel" 
        style={{ 
          padding: '1rem', 
          marginTop: 'auto', 
          background: 'rgba(255, 255, 255, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActivePage('profile')}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-primary-glow)'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user.role === 'admin' ? 'Supervisor' : user.rollNo}
                </p>
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', width: '100%', fontSize: '0.8rem', gap: '0.25rem' }}
            >
              <FaSignOutAlt size={14} /> Logout
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Access student scheduling and mess features.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={onOpenLoginModal}
              style={{ width: '100%', padding: '0.6rem' }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
