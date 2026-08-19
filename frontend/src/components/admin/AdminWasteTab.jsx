import React, { memo } from 'react';
import { FaTrashAlt, FaClipboardList } from 'react-icons/fa';

const AdminWasteTab = memo(function AdminWasteTab({ adminHook }) {
  const {
    wasteLogs,
    wasteDate,
    setWasteDate,
    wasteMeal,
    setWasteMeal,
    wasteMenuItem,
    setWasteMenuItem,
    cookedMeals,
    setCookedMeals,
    actualDiners,
    setActualDiners,
    preConsumerWaste,
    setPreConsumerWaste,
    postConsumerWaste,
    setPostConsumerWaste,
    handleLogWaste
  } = adminHook;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaTrashAlt style={{ color: 'var(--primary)' }} /> Record Daily Mess Waste Log
        </h3>
        <form onSubmit={handleLogWaste} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Log Date</label>
            <input type="date" className="form-control-glass" value={wasteDate} onChange={(e) => setWasteDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Meal Type</label>
            <select className="form-control-glass" value={wasteMeal} onChange={(e) => setWasteMeal(e.target.value)}>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div className="form-group">
            <label>Menu Description</label>
            <input type="text" className="form-control-glass" placeholder="e.g. Veg Biryani, Raitha" value={wasteMenuItem} onChange={(e) => setWasteMenuItem(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Cooked Meals Count</label>
            <input type="number" className="form-control-glass" value={cookedMeals} onChange={(e) => setCookedMeals(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Actual Diners Count</label>
            <input type="number" className="form-control-glass" value={actualDiners} onChange={(e) => setActualDiners(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Pre-Consumer Waste (kg)</label>
            <input type="number" className="form-control-glass" value={preConsumerWaste} onChange={(e) => setPreConsumerWaste(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Post-Consumer Waste (kg)</label>
            <input type="number" className="form-control-glass" value={postConsumerWaste} onChange={(e) => setPostConsumerWaste(e.target.value)} required />
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Save Daily Waste Entry
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClipboardList style={{ color: 'var(--primary)' }} /> Waste History Log Records
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Menu Item</th>
                <th>Cooked</th>
                <th>Diners</th>
                <th>Pre-Waste</th>
                <th>Post-Waste</th>
                <th>Total Waste</th>
              </tr>
            </thead>
            <tbody>
              {wasteLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.meal}</td>
                  <td>{log.menuItem}</td>
                  <td>{log.cookedMeals}</td>
                  <td>{log.actualDiners}</td>
                  <td>{log.preConsumerWaste} kg</td>
                  <td>{log.postConsumerWaste} kg</td>
                  <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{log.preConsumerWaste + log.postConsumerWaste} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default AdminWasteTab;
