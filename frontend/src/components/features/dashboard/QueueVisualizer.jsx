import React, { memo } from 'react';
import { FaUserFriends, FaCheckCircle, FaExclamationTriangle, FaUtensils, FaClock, FaInfoCircle } from 'react-icons/fa';

const QueueVisualizer = memo(function QueueVisualizer({ occupancyPercentage = 45, waitTimeMinutes = 6 }) {
  
  const getStatusColor = () => {
    if (waitTimeMinutes > 9) return '#ff416c';
    if (waitTimeMinutes > 5) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = () => {
    if (waitTimeMinutes > 9) return 'Peak Window (Higher Crowd)';
    if (waitTimeMinutes > 5) return 'Moderate Traffic Range';
    return 'Smooth Flow (Short Queue)';
  };

  const getEstimatedDinerRange = () => {
    if (waitTimeMinutes > 9) return '~450 – 580 Diners';
    if (waitTimeMinutes > 5) return '~270 – 340 Diners';
    return '~120 – 180 Diners';
  };

  const getWaitRange = () => {
    if (waitTimeMinutes > 9) return '~10 – 14 mins';
    if (waitTimeMinutes > 5) return '~4 – 7 mins';
    return '~1 – 3 mins';
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUserFriends style={{ color: 'var(--primary)' }} /> Mess Hall Estimated Traffic & Crowd Indicator
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Statistical crowd estimations based on historical dining time averages
          </p>
        </div>
        <div style={{
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          background: `${getStatusColor()}20`,
          border: `1px solid ${getStatusColor()}60`,
          color: getStatusColor(),
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {waitTimeMinutes > 9 ? <FaExclamationTriangle /> : <FaCheckCircle />}
          {getStatusText()}
        </div>
      </div>

      {/* Realistic Statistical Range Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>ESTIMATED WAIT</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: getStatusColor(), fontFamily: 'var(--font-title)' }}>
            {getWaitRange()}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>TYPICAL CROWD DENSITY</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>
            {getEstimatedDinerRange()}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>SERVING COUNTER</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
            Main Counter <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>1 Single Counter</span>
          </span>
        </div>
      </div>

      {/* Historical Crowd Range Meter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-primary)' }}>Expected Mealtime Density Range</span>
          <span style={{ color: getStatusColor() }}>
            {waitTimeMinutes > 9 ? 'Peak Range' : waitTimeMinutes > 5 ? 'Moderate Average' : 'Light Average'}
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '14px',
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '7px',
          overflow: 'hidden',
          border: '1px solid var(--border-glass)',
          position: 'relative'
        }}>
          <div style={{
            width: `${occupancyPercentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, #10b981 0%, #00d2ff 50%, ${getStatusColor()} 100%)`,
            borderRadius: '7px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 12px ${getStatusColor()}`
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>
          <span>🟢 Light (&lt; 180)</span>
          <span>🟡 Moderate (180 – 380)</span>
          <span>🔴 Heavy Peak (&gt; 380)</span>
        </div>
      </div>

      {/* Single Main Serving Counter Speed & Status */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Main Serving Counter Speed & Status</span>
          <span style={{ color: 'var(--text-muted)' }}>Average ~45 plates / min</span>
        </div>

        <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FaUtensils style={{ color: '#10b981', fontSize: '1.1rem' }} />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>Main Dining Serving Counter</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unified Campus Serving Line</span>
            </div>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
            🟢 Active Serving Line
          </span>
        </div>
      </div>

      {/* Realistic Statistical Footnote Note */}
      <div style={{
        marginTop: '1.2rem',
        padding: '0.7rem 0.9rem',
        background: 'rgba(0, 82, 212, 0.05)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaInfoCircle style={{ color: 'var(--primary)', flexShrink: 0, fontSize: '0.85rem' }} />
        <span>
          Traffic metrics are statistical estimations calculated from historical dining averages for this meal window. Exact headcount is an average range.
        </span>
      </div>
    </div>
  );
});

export default QueueVisualizer;
