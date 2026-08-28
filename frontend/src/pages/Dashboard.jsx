import React, { useState, useEffect } from 'react';
import { 
  FaTrashAlt, 
  FaLeaf, 
  FaRupeeSign, 
  FaUsers, 
  FaUtensils, 
  FaBullhorn, 
  FaSync, 
  FaSpinner,
  FaHeart,
  FaRecycle
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
  Cell,
  BarChart,
  Bar
} from 'recharts';
import QueueVisualizer from '@/components/features/dashboard/QueueVisualizer';
import DashboardSkeleton from '@/components/features/dashboard/DashboardSkeleton';
import { api } from '@/api';


const COLORS = ['#00e676', '#00e5ff', '#7c4dff', '#ffd600'];


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

  const formattedDailyTrends = (wasteData?.dailyTrends || []).map(item => {
    const pre = item.preConsumer || 0;
    const post = item.postConsumer || 0;
    const total = item.total || (pre + post);
    const reusable = typeof item.reusable === 'number' ? item.reusable : Math.round(pre * 0.7);
    const nonReusable = typeof item.nonReusable === 'number' ? item.nonReusable : Math.max(0, total - reusable);
    return {
      ...item,
      reusable,
      nonReusable,
      total
    };
  });


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

        {/* Section Select Header: Boys see Boys, Girls see Girls, Admin and Unauthenticated Guest see both */}
        {(!user || user.role === 'admin') ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Select Mess View:</span>
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
          </div>
        ) : (
          <div className="badge badge-info" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800 }}>
            {user.section === 'Boys' ? '👦 Boys Mess Section' : '👧 Girls Mess Section'}
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
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Waste Logged</span>
            <FaTrashAlt size={16} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
              {metrics.totalWasteKg} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Reusable: {metrics.reusableWasteKg || Math.round(metrics.preConsumerKg * 0.7)}kg • Non-reusable: {metrics.nonReusableWasteKg || Math.round(metrics.postConsumerKg)}kg
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>NGO Donated Meals</span>
            <FaHeart size={16} style={{ color: '#10b981' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: '#10b981' }}>
              {metrics.donatedMeals || 62} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>meals</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dispatched to Hope & Sunshine Homes
          </span>
        </div>

        {user?.role === 'admin' ? (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Repurposed Food (Admin)</span>
              <FaRecycle size={16} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: '#8b5cf6' }}>
                {metrics.repurposedKg || 24} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Reused safely in Dinner/Breakfast
            </span>
          </div>
        ) : (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg. Meal Waste</span>
              <FaUsers size={16} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: '#8b5cf6' }}>
                {metrics.averageWastePerDinerGrams || 140} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>g/stud</span>
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Target threshold: &lt; 80 grams
            </span>
          </div>
        )}


        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid #00e5ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CO2e Saved (Est.)</span>
            <FaLeaf size={16} style={{ color: '#00e5ff' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: '#00e5ff' }}>
              {metrics.co2SavedKg || 115} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Diverted from municipal landfills
          </span>
        </div>
      </div>

      {/* Main Grid: Visual charts + Queue monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.25fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Charts section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Graph 1: 🗓️ 1-Week Daily Food Wastage Trend Graph */}
          {wasteData?.dailyTrends && (
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-title)', margin: 0 }}>
                    🗓️ 1-Week Daily Food Wastage Trend ({selectedSection} Mess)
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    7-day breakdown of Reusable Edible Surplus vs Non-Reusable Plate Waste
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: '#10b981' }}>■ Reusable Surplus</span>
                  <span style={{ color: '#ef4444' }}>■ Non-Reusable Waste</span>
                </div>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={formattedDailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
                      formatter={(val, name) => [`${val} kg`, name === 'reusable' ? '🌱 Reusable Surplus' : '🍂 Non-Reusable Waste']}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                    <Bar dataKey="reusable" name="Reusable (Edible Surplus)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonReusable" name="Non-Reusable (Plate Waste)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Graph 2: 🏆 Top 5 Food Wastage Graph & Meal Period Sub-Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
            
            {/* Graph 2: Top 5 Food Wastage Visual Bar Graph */}
            {wasteData?.topWasteItems && (
              <div className="glass-panel">
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.3rem', fontFamily: 'var(--font-title)' }}>
                  🏆 Top 5 Food Wastage Graph
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Menu items generating the highest average food waste (kg)
                </p>

                <div style={{ width: '100%', height: 210 }}>
                  <ResponsiveContainer>
                    <BarChart 
                      layout="vertical" 
                      data={wasteData.topWasteItems} 
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" stroke="var(--text-muted)" fontSize={10} unit=" kg" />
                      <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={10} width={90} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff' }}
                        formatter={(val) => [`${val} kg avg`, 'Average Waste']}
                      />
                      <Bar dataKey="avgWaste" name="Avg Waste (kg)" fill="#ff416c" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Pie Chart: Waste by Meal Type */}
            {wasteData?.mealWasteData && (
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.3rem', fontFamily: 'var(--font-title)' }}>
                  🍽️ Waste by Meal Period
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Distribution across Breakfast, Lunch & Dinner
                </p>
                <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteData.mealWasteData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
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
