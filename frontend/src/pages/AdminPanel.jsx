import React, { useState, lazy, Suspense } from 'react';
import { FaTrashAlt, FaUtensils, FaVoteYea, FaClock, FaChartBar, FaUserCog, FaBullhorn, FaCheckCircle, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useAdminData } from '@/hooks';


import {
  AdminWasteTab,
  AdminMenuTab,
  AdminPollTab,
  AdminReservationsTab,
  AdminUsersTab,
  AdminNotificationsTab
} from '@/components/features/admin';

// Code-split heavy chart tab
const AdminAnalyticsTab = lazy(() => import('@/components/features/admin/AdminAnalyticsTab'));


const TabLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--primary)' }}>
    <div className="spinner-sm" style={{ width: '28px', height: '28px' }} />
  </div>
);

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState('waste');
  const adminHook = useAdminData();
  const { selectedSection, setSelectedSection, actionSuccess, actionError, usersList, menuItems, polls, reservations } = adminHook;

  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const activePolls = polls.filter(p => p.status === 'open').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Top Controls Header */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-title)', margin: 0 }}>
            Mess Administration & Waste Control Panel
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Manage menus, student polls, accounts (@bitsathy.ac.in), broadcasts, late plates, and waste analytics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.06)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Section View:</span>
          <select 
            className="form-control-glass"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            style={{ width: '140px', padding: '0.35rem 0.75rem', fontWeight: 700 }}
          >
            <option value="Boys">Boys Mess</option>
            <option value="Girls">Girls Mess</option>
          </select>
        </div>
      </div>

      {/* Real-Time Admin Summary KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-box" style={{ background: 'var(--primary-gradient)' }}>
            <FaUsers />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Users</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{usersList.length}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-box" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <FaUtensils />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{selectedSection} Meals</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{menuItems.length}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-box" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
            <FaVoteYea />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Food Polls</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{activePolls}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-box" style={{ background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' }}>
            <FaClock />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Late Plates</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{pendingReservations}</h3>
          </div>
        </div>
      </div>

      {/* Action Notifications */}
      {actionSuccess && (
        <div className="auth-alert auth-alert-success">
          <FaCheckCircle /> {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="auth-alert auth-alert-error">
          {actionError}
        </div>
      )}

      {/* Elevated Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'waste' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('waste')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaTrashAlt /> Waste Logging
        </button>
        <button className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('menu')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaUtensils /> Menu Schedule
        </button>
        <button className={`btn ${activeTab === 'polls' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('polls')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaVoteYea /> Food Polls {activePolls > 0 && <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>{activePolls}</span>}
        </button>
        <button className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('notifications')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaBullhorn /> Broadcast Alerts
        </button>
        <button className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('reservations')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaClock /> Late Plate Admin {pendingReservations > 0 && <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>{pendingReservations}</span>}
        </button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('users')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaUserCog /> User Accounts ({usersList.length})
        </button>
        <button className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('analytics')} style={{ gap: '0.4rem', padding: '0.65rem 1.1rem' }}>
          <FaChartBar /> Waste Analytics
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'waste' && <AdminWasteTab adminHook={adminHook} />}
      {activeTab === 'menu' && <AdminMenuTab adminHook={adminHook} />}
      {activeTab === 'polls' && <AdminPollTab adminHook={adminHook} />}
      {activeTab === 'notifications' && <AdminNotificationsTab adminHook={adminHook} />}
      {activeTab === 'reservations' && <AdminReservationsTab adminHook={adminHook} />}
      {activeTab === 'users' && <AdminUsersTab adminHook={adminHook} />}
      {activeTab === 'analytics' && (
        <Suspense fallback={<TabLoader />}>
          <AdminAnalyticsTab adminHook={adminHook} />
        </Suspense>
      )}

    </div>
  );
}
