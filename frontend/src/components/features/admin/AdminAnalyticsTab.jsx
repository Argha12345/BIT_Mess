import React, { memo } from 'react';
import { FaChartBar, FaStar, FaTrashAlt, FaHeart, FaRecycle, FaLeaf, FaShieldAlt } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const AdminAnalyticsTab = memo(function AdminAnalyticsTab({ adminHook }) {
  const { wasteAnalytics, feedbacks, handleDeleteReview } = adminHook;

  if (!wasteAnalytics) return null;

  const metrics = wasteAnalytics.metrics || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>


      {/* 2. Top Metric KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #10b981' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>🌱 Reusable Surplus</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>{metrics.reusableWasteKg || 0} kg</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Edible food diverted from landfill</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #ef4444' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>🍂 Non-Reusable Waste</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', margin: '0.2rem 0' }}>{metrics.nonReusableWasteKg || 0} kg</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Plate waste suitable for compost</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #00e5ff' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>❤️ NGO Donations</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00e5ff', margin: '0.2rem 0' }}>{metrics.donatedMeals || 0} meals</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Dispatched to Orphanages & Shelters</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem', borderTop: '3px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>🔄 Repurposed Food</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', margin: '0.2rem 0' }}>{metrics.repurposedKg || 0} kg</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reused in Dinner/Breakfast meals</span>
        </div>
      </div>

      {/* 3. Graph 1: 🗓️ 1-Week Daily Food Wastage Trend Graph */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaChartBar style={{ color: 'var(--primary)' }} /> 🗓️ 1-Week Daily Food Wastage Trend Graph
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              7-day trend of Reusable Edible Surplus vs Non-Reusable Plate Waste
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }} /> Reusable Surplus
            </span>
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} /> Non-Reusable Waste
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteAnalytics.dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
                formatter={(val, name) => [`${val} kg`, name === 'reusable' ? '🌱 Reusable (Surplus Food)' : '🍂 Non-Reusable (Plate Waste)']}
              />
              <Legend />
              <Bar dataKey="reusable" name="Reusable (Edible Surplus)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nonReusable" name="Non-Reusable (Plate Waste)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Graph 2: 🏆 Top 5 Food Wastage Graph */}
      {wasteAnalytics.topWasteItems && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartBar style={{ color: 'var(--secondary)' }} /> 🏆 Top 5 Food Wastage Graph
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Visual ranking of menu items generating the highest average wastage (kg)
          </p>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={wasteAnalytics.topWasteItems} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} unit=" kg" />
                <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff' }}
                  formatter={(val) => [`${val} kg average waste`, 'Avg Waste']}
                />
                <Bar dataKey="avgWaste" name="Avg Waste (kg)" fill="#ff416c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}


      {/* 4. Student Reviews Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaStar style={{ color: '#fde047' }} /> Student Food Quality Feedback & Reviews
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Email / Roll No</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No student reviews recorded yet.
                  </td>
                </tr>
              ) : (
                feedbacks.map(f => (
                  <tr key={f.id}>
                    <td>{f.date}</td>
                    <td style={{ fontWeight: 700 }}>{f.name}</td>
                    <td>{f.rollNo}</td>
                    <td>⭐ {f.rating} / 5</td>
                    <td style={{ fontSize: '0.85rem' }}>{f.comment || 'No comment'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', gap: '0.25rem' }}
                        onClick={() => handleDeleteReview(f.id)}
                      >
                        <FaTrashAlt /> Delete Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
});

export default AdminAnalyticsTab;
