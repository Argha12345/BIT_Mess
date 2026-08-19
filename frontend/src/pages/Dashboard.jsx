import React, { useState, useEffect } from 'react';
import { 
  FaTrashAlt, 
  FaLeaf, 
  FaRupeeSign, 
  FaUsers, 
  FaUtensils, 
  FaBullhorn, 
  FaSync, 
  FaSpinner 
} from 'react-icons/fa';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import QueueVisualizer from '../components/dashboard/QueueVisualizer';
import { api } from '../utils/api';

const COLORS = ['#00e676', '#00e5ff', '#7c4dff', '#ffd600'];

import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

export default function Dashboard({ user, networkStatus }) {
  // Determine default section based on logged in user
  const initialSection = user && user.section && user.section !== 'All' ? user.section : 'Boys';
  const [selectedSection, setSelectedSection] = useState(initialSection);

  const [liveStatus, setLiveStatus] = useState(null);
  const [wasteData, setWasteData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    // Check browser offline status immediately on fetch
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      networkStatus?.markOffline();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Minimal smooth loading timer so skeleton UI is clearly visible when entering website
      const timer = new Promise(r => setTimeout(r, 650));

      const [liveRes, wasteRes, queueRes, menuRes] = await Promise.all([
        api.analytics.getLive(selectedSection).catch(err => {
          if (typeof navigator !== 'undefined' && (!navigator.onLine || err.message?.includes('Failed to fetch'))) {
            networkStatus?.markOffline();
          }
          return mockLiveStatus;
        }),
        api.analytics.getWaste(selectedSection).catch(err => mockWasteData),
        api.analytics.getQueue(selectedSection).catch(err => mockPredictions),
        api.menu.get(selectedSection).catch(err => mockMenu),
        timer
      ]);

      setLiveStatus(liveRes);
      setWasteData(wasteRes);
      setPredictions(queueRes);
      setMenu(menuRes);
    } catch (err) {
      console.error(err);
      if (typeof navigator !== 'undefined' && (!navigator.onLine || err.message?.includes('Failed to fetch'))) {
        networkStatus?.markOffline();
      } else {
        setError('Unable to reach server. Running in Sandbox Mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedSection]);

  // Keep selectedSection in sync when user logs in/out
  useEffect(() => {
    if (user && user.section && user.section !== 'All') {
      setSelectedSection(user.section);
    }
  }, [user]);

  if (loading || networkStatus?.isSlowNetwork) {
    return <DashboardSkeleton isSlowNetwork={networkStatus?.isSlowNetwork} />;
  }

  const getTodayMenu = () => {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMeals = menu.filter(item => item.day === dayName);
    
    if (todayMeals.length === 0) return 'Standard Meals';
    
    const activeMeal = liveStatus ? liveStatus.currentMeal : 'Lunch';
    const mealItem = todayMeals.find(m => m.meal === activeMeal);
    
    return mealItem ? mealItem.items : 'Loading menu...';
  };

  const metrics = wasteData?.metrics || {
    totalWasteKg: 0,
    preConsumerKg: 0,
    postConsumerKg: 0,
    estimatedFinancialLossRs: 0,
    totalMealsWasted: 0
  };

  const totalSavedWasteKg = selectedSection === 'Boys' ? 245 : 180; 
  const totalSavedCostRs = totalSavedWasteKg * 35; 

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {error && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-danger)', background: 'rgba(255, 23, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>⚠️ {error}. Running in Sandbox Mode.</p>
          <button className="btn btn-secondary" onClick={fetchDashboardData} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
            Retry Sync
          </button>
        </div>
      )}

      {/* Section Selector Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem', 
        flexWrap: 'wrap', 
        gap: '1rem',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
            Viewing: <span style={{ color: 'var(--primary)' }}>{selectedSection} Mess Section</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time scanner metrics, recipes, and notice board partitioned by gender.
          </p>
        </div>

        {/* Section Select Toggle buttons */}
        {(!user || user.role === 'admin') ? (
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.02)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => setSelectedSection('Boys')}
              className="btn"
              style={{
                background: selectedSection === 'Boys' ? 'var(--primary)' : 'transparent',
                color: selectedSection === 'Boys' ? '#050a0c' : 'var(--text-secondary)',
                padding: '0.4rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'calc(var(--radius-sm) - 2px)'
              }}
            >
              Boys Mess
            </button>
            <button
              onClick={() => setSelectedSection('Girls')}
              className="btn"
              style={{
                background: selectedSection === 'Girls' ? 'var(--primary)' : 'transparent',
                color: selectedSection === 'Girls' ? '#050a0c' : 'var(--text-secondary)',
                padding: '0.4rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'calc(var(--radius-sm) - 2px)'
              }}
            >
              Girls Mess
            </button>
          </div>
        ) : (
          <div className="badge badge-info" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            My Assigned Section: {user.section}
          </div>
        )}
      </div>

      {/* Top Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Current Menu Card */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaUtensils size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              Active Menu • {liveStatus?.currentMeal || 'Lunch'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0', fontFamily: 'var(--font-title)' }}>
              {getTodayMenu()}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Selected based on college calendar & recipe planning.
            </p>
          </div>
        </div>

        {/* Sync trigger card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={fetchDashboardData}
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaSync size={14} />
          </button>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>Live Dashboard Sync</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-updates every 30s</span>
          </div>
        </div>
      </div>

      {/* KPI Overview row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Plate Waste Today</span>
            <FaTrashAlt size={16} style={{ color: 'var(--color-danger)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
              {metrics.totalWasteKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Pre-consumer: {metrics.preConsumerKg}kg • Post-consumer: {metrics.postConsumerKg}kg
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Waste Prevented</span>
            <FaLeaf size={16} style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--primary)' }}>
              {totalSavedWasteKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Portion forecasting scale active
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cost Saved (Est.)</span>
            <FaRupeeSign size={16} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--secondary)' }}>
              ₹{totalSavedCostRs.toLocaleString('en-IN')}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Saved through recipe planning
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg. Meal Waste</span>
            <FaUsers size={16} style={{ color: 'var(--color-info)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
              {metrics.averageWastePerDinerGrams || 140} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>g/stud</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Target threshold: &lt; 80 grams
          </span>
        </div>
      </div>

      {/* Main Grid: Visual charts + Queue monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Charts section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Waste Trends Area Chart */}
          {wasteData?.dailyTrends && (
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>
                Food Waste Volume Trends ({selectedSection} Mess)
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={wasteData.dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPre" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff1744" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ff1744" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-glass-light)', borderRadius: '12px', color: '#fff', boxShadow: 'var(--shadow-glass)' }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Area type="monotone" name="Kitchen (Pre-Consumer)" dataKey="preConsumer" stroke="#00d2ff" fillOpacity={1} fill="url(#colorPre)" strokeWidth={2.5} />
                    <Area type="monotone" name="Plate Waste (Post-Consumer)" dataKey="postConsumer" stroke="#f87171" fillOpacity={1} fill="url(#colorPost)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Bottom sub-grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
            
            {/* Pie Chart: Waste by Meal Type */}
            {wasteData?.mealWasteData && (
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
                  Waste by Meal Period
                </h3>
                <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteData.mealWasteData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="total"
                      >
                        {wasteData.mealWasteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} kg`} contentStyle={{ background: '#12191d', border: '1px solid var(--border-glass)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {wasteData.mealWasteData.map((item, index) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}: {item.total}kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Waste correlation list */}
            {wasteData?.topWasteItems && (
              <div className="glass-panel">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'var(--font-title)' }}>
                  High-Waste Menu Items
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Items with highest average waste generated.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {wasteData.topWasteItems.map((item, index) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {index + 1}. {item.name}
                      </span>
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                        {item.avgWaste} kg avg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Announcements Card */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-title)' }}>
              <FaBullhorn size={16} style={{ color: 'var(--primary)' }} /> Notice Board & Announcements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(!liveStatus?.announcements || liveStatus.announcements.length === 0) ? (
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📢 Separate Boys & Girls Mess operations active. Check student voting polls for next week's menu options!
                </div>
              ) : (
                liveStatus.announcements.map(ann => (
                  <div 
                    key={ann.id} 
                    style={{ 
                      padding: '0.85rem', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--border-glass)', 
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: `3px solid ${ann.category === 'important' ? 'var(--color-danger)' : 'var(--primary)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {ann.title || 'Mess Menu Announcement'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {ann.date || (ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Today')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                      {ann.content || ann.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right side: Live occupancy */}
        <QueueVisualizer 
          liveStatus={liveStatus} 
          predictions={predictions} 
          user={user} 
          section={selectedSection}
          onRefresh={fetchDashboardData}
        />
      </div>
    </div>
  );
}

const mockLiveStatus = {
  currentMeal: 'Lunch',
  currentSlot: '12:30 PM - 01:00 PM',
  totalCheckedInThisMeal: 212,
  occupancyPercentage: 28,
  averageWaitTimeMinutes: 4,
  queueStatus: 'Smooth',
  servingCountersOpen: 3,
  announcements: [
    { id: 'a1', date: '2026-07-29', title: 'Separate Boys & Girls Mess Active', content: 'Hostel mess operations have been separated into Boys and Girls sections. Students can recommend meals 1 week prior.', category: 'important' }
  ]
};

const mockPredictions = {
  Lunch: [
    { slot: '12:00 PM - 12:30 PM', avgOccupancy: 180, waitTimeMin: 3, label: 'Fast' },
    { slot: '12:30 PM - 01:00 PM', avgOccupancy: 360, waitTimeMin: 8, label: 'Crowded' },
    { slot: '01:00 PM - 01:30 PM', avgOccupancy: 410, waitTimeMin: 11, label: 'Peak Hour' },
    { slot: '01:30 PM - 02:00 PM', avgOccupancy: 200, waitTimeMin: 4, label: 'Moderate' }
  ]
};

const mockMenu = [
  { id: 'm-boys-2', day: 'Monday', meal: 'Lunch', items: 'White Rice, Sambar, Poriyal, Curd, Appalam', popularity: 6 }
];

const mockWasteData = {
  metrics: {
    totalWasteKg: 52,
    preConsumerKg: 17,
    postConsumerKg: 35,
    totalMealsCooked: 600,
    totalActualDiners: 520,
    averageWastePerDinerGrams: 100,
    estimatedFinancialLossRs: 1820,
    totalMealsWasted: 148
  },
  dailyTrends: [
    { date: '07-25', preConsumer: 15, postConsumer: 40, total: 55 },
    { date: '07-26', preConsumer: 18, postConsumer: 30, total: 48 }
  ],
  mealWasteData: [
    { name: 'Breakfast', total: 21 },
    { name: 'Lunch', total: 58 },
    { name: 'Dinner', total: 38 }
  ],
  topWasteItems: [
    { name: 'Rava Upma', avgWaste: 55 },
    { name: 'Semiya Upma', avgWaste: 48 }
  ]
};
