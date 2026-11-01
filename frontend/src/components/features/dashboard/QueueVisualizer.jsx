import React, { memo, useState, useEffect } from 'react';
import { 
  FaUserFriends, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaUtensils, 
  FaClock, 
  FaInfoCircle,
  FaSun,
  FaCoffee,
  FaMoon,
  FaEye,
  FaTimesCircle
} from 'react-icons/fa';

// Official Mess Dining Timings:
// - Morning Breakfast: 07:00 AM – 08:30 AM (420 - 510 min)
// - Afternoon Lunch:   12:15 PM – 01:45 PM (735 - 825 min)
// - Evening Snacks:    04:00 PM – 05:30 PM (960 - 1050 min)
// - Night Dinner:      07:00 PM – 09:00 PM (1140 - 1260 min)
export const DINING_SCHEDULE = [
  { 
    id: 'breakfast', 
    name: 'Breakfast', 
    title: 'Morning Breakfast', 
    startMin: 7 * 60,         // 07:00 AM (420)
    endMin: 8 * 60 + 30,      // 08:30 AM (510)
    display: '07:00 AM – 08:30 AM',
    icon: FaSun,
    color: '#f59e0b'
  },
  { 
    id: 'lunch', 
    name: 'Lunch', 
    title: 'Afternoon Lunch', 
    startMin: 12 * 60 + 15,   // 12:15 PM (735)
    endMin: 13 * 60 + 45,     // 01:45 PM (825)
    display: '12:15 PM – 01:45 PM',
    icon: FaUtensils,
    color: '#00d2ff'
  },
  { 
    id: 'snacks', 
    name: 'Snacks', 
    title: 'Evening Snacks', 
    startMin: 16 * 60,        // 04:00 PM (960)
    endMin: 17 * 60 + 30,     // 05:30 PM (1050)
    display: '04:00 PM – 05:30 PM',
    icon: FaCoffee,
    color: '#8b5cf6'
  },
  { 
    id: 'dinner', 
    name: 'Dinner', 
    title: 'Night Dinner', 
    startMin: 19 * 60,        // 07:00 PM (1140)
    endMin: 21 * 60,          // 09:00 PM (1260)
    display: '07:00 PM – 09:00 PM',
    icon: FaMoon,
    color: '#10b981'
  }
];

export function getDiningStatus(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of DINING_SCHEDULE) {
    if (currentMinutes >= slot.startMin && currentMinutes <= slot.endMin) {
      return {
        isActive: true,
        currentSlot: slot,
        currentMeal: slot.name,
        remainingMinutes: slot.endMin - currentMinutes
      };
    }
  }

  // Find next upcoming meal
  let nextSlot = null;
  for (const slot of DINING_SCHEDULE) {
    if (currentMinutes < slot.startMin) {
      nextSlot = slot;
      break;
    }
  }
  if (!nextSlot) {
    nextSlot = DINING_SCHEDULE[0]; // Tomorrow's breakfast
  }

  return {
    isActive: false,
    currentSlot: null,
    currentMeal: null,
    nextSlot
  };
}

const QueueVisualizer = memo(function QueueVisualizer({ 
  liveStatus, 
  predictions, 
  user, 
  section, 
  occupancyPercentage: propOccupancy, 
  waitTimeMinutes: propWaitTime 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previewActiveMode, setPreviewActiveMode] = useState(false);

  // Keep live time synchronized every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const diningStatus = getDiningStatus(currentTime);
  const isCurrentlyActive = diningStatus.isActive || previewActiveMode;

  // Resolve values from liveStatus or fallback props
  const occupancyPercentage = liveStatus?.occupancyPercentage ?? propOccupancy ?? 48;
  const waitTimeMinutes = liveStatus?.averageWaitTimeMinutes ?? propWaitTime ?? 6;

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

  const formatClock = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaUserFriends style={{ color: 'var(--primary)' }} /> Mess Hall Estimated Traffic & Crowd Indicator
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            {isCurrentlyActive 
              ? 'Statistical crowd estimations based on historical dining time averages' 
              : 'Official service schedule & automated dining hall status indicator'}
          </p>
        </div>

        {/* Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isCurrentlyActive ? (
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
          ) : (
            <div style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <FaTimesCircle /> Currently Dining Not Available
            </div>
          )}
        </div>
      </div>

      {/* RENDER ACTIVE MODE */}
      {isCurrentlyActive ? (
        <>
          {previewActiveMode && !diningStatus.isActive && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              fontSize: '0.72rem',
              color: 'var(--primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>👁️ <strong>Preview Active Mode</strong> (Real-time clock is currently outside service hours).</span>
              <button 
                onClick={() => setPreviewActiveMode(false)}
                className="btn btn-secondary"
                style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
              >
                Exit Preview
              </button>
            </div>
          )}

          {/* Active Meal Banner */}
          {diningStatus.currentSlot && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                🟢 Now Serving: <strong style={{ color: '#10b981' }}>{diningStatus.currentSlot.name}</strong> ({diningStatus.currentSlot.display})
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                Closes in ~{diningStatus.remainingMinutes}m
              </span>
            </div>
          )}

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
        </>
      ) : (
        /* RENDER INACTIVE / CLOSED MODE */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Hero Closed Notice Card */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 0.75rem',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}>
              <FaClock />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem', fontFamily: 'var(--font-title)' }}>
              Currently Dining Not Available
            </h4>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
              The mess dining hall is currently closed between meal service periods. Real-time traffic, queue waiting times, and serving counters automatically activate during scheduled timings.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                background: 'rgba(0, 0, 0, 0.08)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                <FaClock style={{ color: 'var(--primary)' }} /> Current Time: {formatClock(currentTime)}
              </div>

              {diningStatus.nextSlot && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#10b981'
                }}>
                  <FaUtensils /> Next Meal: <strong>{diningStatus.nextSlot.name}</strong> ({diningStatus.nextSlot.display.split('–')[0].trim()})
                </div>
              )}
            </div>
          </div>

          {/* Official Dining Timings Schedule */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '0.65rem'
            }}>
              Official Daily Meal Service Timings:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' }}>
              {DINING_SCHEDULE.map(slot => {
                const IconComponent = slot.icon;
                const isNext = diningStatus.nextSlot?.id === slot.id;

                return (
                  <div 
                    key={slot.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isNext ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-glass)',
                      background: isNext ? 'rgba(16, 185, 129, 0.06)' : undefined,
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <IconComponent style={{ color: slot.color, fontSize: '0.85rem' }} /> {slot.name}
                      </span>
                      {isNext && (
                        <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>
                          Next
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: isNext ? '#10b981' : 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>
                      {slot.display}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Serving Counter Speed & Status (Closed View) */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(0, 0, 0, 0.05)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaUtensils style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }} />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>Main Dining Serving Counter</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Opens next at {diningStatus.nextSlot?.display.split('–')[0].trim()}</span>
                </div>
              </div>
              <span className="badge" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', background: 'rgba(0,0,0,0.1)', color: 'var(--text-muted)' }}>
                ⚪ Service Inactive
              </span>
            </div>
          </div>

          {/* Quick Demo Preview Button */}
          <div style={{
            marginTop: '1rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(0, 82, 212, 0.05)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <FaInfoCircle style={{ color: 'var(--primary)' }} />
              <span>Testing outside meal hours?</span>
            </div>
            <button
              onClick={() => setPreviewActiveMode(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', gap: '0.35rem' }}
            >
              <FaEye /> Preview Active Crowd Meter
            </button>
          </div>

        </div>
      )}

    </div>
  );
});

export default QueueVisualizer;
