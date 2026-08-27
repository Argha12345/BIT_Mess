import React, { useState, lazy, Suspense } from 'react';
import { Sidebar, Header, OfflineScreen } from '@/components/common';
import { useNetworkStatus } from '@/hooks';
import { api } from '@/api';
import DashboardSkeleton from '@/components/features/dashboard/DashboardSkeleton';

// Code Splitting - Lazy-loaded Page Routes & Modals
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StudentPortal = lazy(() => import('@/pages/StudentPortal'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));


const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: 'var(--primary)' }}>
    <div className="spinner-sm" style={{ width: '32px', height: '32px', borderTopColor: 'var(--primary)' }} />
  </div>
);

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'dashboard';
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  const networkStatus = useNetworkStatus();

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const changeActivePage = (page) => {
    setActivePage(page);
    localStorage.setItem('activePage', page);
  };

  const handleLogout = () => {
    api.auth.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('activePage');
    setUser(null);
    changeActivePage('dashboard');
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Live Traffic & Food Waste Monitor';
      case 'student-portal': return 'Student Planning Portal';
      case 'admin-panel': return 'Mess Administration Dashboard';
      case 'profile': return 'My Account Profile & Security Settings';
      default: return 'BIT Mess Optimization';
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Glassmorphism Ambient Mesh Background Orbs */}
      <div className="ambient-mesh">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      {/* Side Menu Navigation */}
      <Sidebar 
        user={user} 
        activePage={activePage} 
        setActivePage={changeActivePage} 
        handleLogout={handleLogout}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      {/* Main Page Content */}
      <main className="main-content">
        <Header user={user} pageTitle={getPageTitle()} networkStatus={networkStatus} />

        {networkStatus.isOffline ? (
          <OfflineScreen 
            onRetry={networkStatus.retryConnection} 
            isRetrying={networkStatus.isRetrying} 
          />
        ) : (
          <Suspense fallback={<DashboardSkeleton />}>
            {activePage === 'dashboard' && <Dashboard user={user} networkStatus={networkStatus} />}
            {activePage === 'student-portal' && <StudentPortal user={user} />}
            {activePage === 'admin-panel' && <AdminPanel user={user} />}
            {activePage === 'profile' && <Profile user={user} />}
          </Suspense>
        )}
      </main>

      {/* Immersive 3D Interactive Login Screen */}
      {showLoginModal && (
        <Suspense fallback={<PageLoader />}>
          <Login 
            setUser={updateUser}
            setActivePage={changeActivePage}
            onClose={() => setShowLoginModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

