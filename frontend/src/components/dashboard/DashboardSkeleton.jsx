import React from 'react';

export default function DashboardSkeleton({ isSlowNetwork }) {
  return (
    <div className="skeleton-dashboard-wrapper">
      {/* Slow network notification bar if applicable */}
      {isSlowNetwork && (
        <div className="slow-network-banner">
          <div className="slow-dot"></div>
          <span>Slow Internet Connection Detected — Loading Dashboard Analytics...</span>
        </div>
      )}

      {/* Header bar placeholder */}
      <div className="skeleton-header-bar">
        <div className="skeleton-bar skeleton-title-bar" style={{ width: '280px', height: '24px' }}></div>
        <div className="skeleton-bar skeleton-subtitle-bar" style={{ width: '380px', height: '14px', marginTop: '8px' }}></div>
      </div>

      {/* Top Banner Grid Placeholder */}
      <div className="skeleton-banner-grid">
        <div className="skeleton-card skeleton-menu-banner">
          <div className="skeleton-bar" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton-bar" style={{ width: '120px', height: '12px', marginBottom: '8px' }}></div>
            <div className="skeleton-bar" style={{ width: '220px', height: '20px', marginBottom: '8px' }}></div>
            <div className="skeleton-bar" style={{ width: '180px', height: '12px' }}></div>
          </div>
        </div>

        <div className="skeleton-card skeleton-sync-banner">
          <div className="skeleton-bar" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
          <div className="skeleton-bar" style={{ width: '100px', height: '12px', marginTop: '6px' }}></div>
        </div>
      </div>

      {/* 4 KPI Summary Cards Grid Placeholder */}
      <div className="skeleton-kpi-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-card skeleton-kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-bar" style={{ width: '90px', height: '12px' }}></div>
              <div className="skeleton-bar" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div>
            </div>
            <div className="skeleton-bar" style={{ width: '70px', height: '28px', margin: '10px 0 6px' }}></div>
            <div className="skeleton-bar" style={{ width: '120px', height: '10px' }}></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid (Charts + Right Queue Column) */}
      <div className="skeleton-main-grid">
        
        {/* Left Column: Area Chart + Sub-charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Area Chart Container */}
          <div className="skeleton-card skeleton-chart-container">
            <div className="skeleton-bar" style={{ width: '240px', height: '18px', marginBottom: '1.5rem' }}></div>
            <div className="skeleton-chart-placeholder">
              <div className="skeleton-chart-lines">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
          </div>

          {/* Sub-grid: Pie Chart & High Waste Items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
            <div className="skeleton-card" style={{ padding: '1.25rem' }}>
              <div className="skeleton-bar" style={{ width: '140px', height: '16px', marginBottom: '1rem' }}></div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <div className="skeleton-circle-donut"></div>
              </div>
            </div>

            <div className="skeleton-card" style={{ padding: '1.25rem' }}>
              <div className="skeleton-bar" style={{ width: '160px', height: '16px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-bar" style={{ width: '200px', height: '10px', marginBottom: '1rem' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div className="skeleton-bar" style={{ width: '100%', height: '14px' }}></div>
                <div className="skeleton-bar" style={{ width: '85%', height: '14px' }}></div>
                <div className="skeleton-bar" style={{ width: '90%', height: '14px' }}></div>
              </div>
            </div>
          </div>

          {/* Announcements Card Skeleton */}
          <div className="skeleton-card" style={{ padding: '1.25rem' }}>
            <div className="skeleton-bar" style={{ width: '220px', height: '18px', marginBottom: '1rem' }}></div>
            <div className="skeleton-bar" style={{ width: '100%', height: '40px', borderRadius: '8px' }}></div>
          </div>
        </div>

        {/* Right Column: Queue Visualizer Skeleton */}
        <div className="skeleton-card skeleton-sidebar-container" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="skeleton-bar" style={{ width: '160px', height: '18px' }}></div>
            <div className="skeleton-bar" style={{ width: '70px', height: '24px', borderRadius: '12px' }}></div>
          </div>

          <div className="skeleton-bar" style={{ width: '100%', height: '90px', borderRadius: '12px', marginBottom: '1rem' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="skeleton-bar" style={{ height: '45px', borderRadius: '8px' }}></div>
            <div className="skeleton-bar" style={{ height: '45px', borderRadius: '8px' }}></div>
            <div className="skeleton-bar" style={{ height: '45px', borderRadius: '8px' }}></div>
          </div>

          <div className="skeleton-bar" style={{ width: '100%', height: '120px', borderRadius: '12px' }}></div>
        </div>

      </div>
    </div>
  );
}
