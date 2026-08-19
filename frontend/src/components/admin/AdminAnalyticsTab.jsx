import React, { memo } from 'react';
import { FaChartBar, FaStar, FaTrashAlt } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminAnalyticsTab = memo(function AdminAnalyticsTab({ adminHook }) {
  const { wasteAnalytics, feedbacks, handleDeleteReview } = adminHook;

  if (!wasteAnalytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>TOTAL WASTE RECORDED</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{wasteAnalytics.metrics.totalWasteKg} kg</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pre: {wasteAnalytics.metrics.preConsumerKg}kg | Post: {wasteAnalytics.metrics.postConsumerKg}kg</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>ESTIMATED FINANCIAL LOSS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>₹{wasteAnalytics.metrics.estimatedFinancialLossRs}</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Approx. {wasteAnalytics.metrics.totalMealsWasted} meals wasted</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>AVG WASTE PER DINER</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{wasteAnalytics.metrics.averageWastePerDinerGrams} g</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Based on {wasteAnalytics.metrics.totalActualDiners} actual diners</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaChartBar style={{ color: 'var(--primary)' }} /> Daily Pre vs Post Consumer Food Waste Trends (kg)
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteAnalytics.dailyTrends}>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(10, 15, 30, 0.9)', borderColor: 'var(--border-glass)', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="preConsumer" name="Pre-Consumer (Kitchen)" fill="#00d2ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="postConsumer" name="Post-Consumer (Plates)" fill="#ff416c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
