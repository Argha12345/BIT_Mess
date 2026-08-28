import React, { memo } from 'react';
import { FaTrashAlt, FaClipboardList, FaHeart, FaRecycle, FaLeaf, FaBuilding } from 'react-icons/fa';
import { DONATION_ORGANIZATIONS, REPURPOSE_MEAL_OPTIONS } from '@/config/constants';

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
    reusableWaste,
    setReusableWaste,
    nonReusableWaste,
    setNonReusableWaste,
    dispositionStatus,
    setDispositionStatus,
    donateOrg,
    setDonateOrg,
    donatedKg,
    setDonatedKg,
    repurposeTargetMeal,
    setRepurposeTargetMeal,
    repurposedKg,
    setRepurposedKg,
    handleLogWaste,
    handleDonateFood,
    handleRepurposeFood
  } = adminHook;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Main Daily Waste & Categorization Logging Form */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaTrashAlt style={{ color: 'var(--primary)' }} /> Record Daily Waste & Categorization
        </h3>
        <form onSubmit={handleLogWaste} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Log Date</label>
            <input type="date" className="form-control-glass" value={wasteDate} onChange={(e) => setWasteDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Meal Session</label>
            <select className="form-control-glass" value={wasteMeal} onChange={(e) => setWasteMeal(e.target.value)}>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div className="form-group">
            <label>Menu Item Description</label>
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

          {/* New Reusable vs Non-Reusable Classification */}
          <div className="form-group" style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <label style={{ color: '#10b981', fontWeight: 800 }}>🌱 Reusable Surplus (kg)</label>
            <input type="number" className="form-control-glass" value={reusableWaste} onChange={(e) => setReusableWaste(e.target.value)} required />
          </div>

          <div className="form-group" style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <label style={{ color: '#ef4444', fontWeight: 800 }}>🍂 Non-Reusable Waste (kg)</label>
            <input type="number" className="form-control-glass" value={nonReusableWaste} onChange={(e) => setNonReusableWaste(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Waste Disposition Status</label>
            <select className="form-control-glass" value={dispositionStatus} onChange={(e) => setDispositionStatus(e.target.value)}>
              <option value="Disposed">Disposed (Compost/Bio-gas)</option>
              <option value="Donated to NGO">Donated to NGO/Orphanage</option>
              <option value="Repurposed for Dinner">Repurposed for Dinner</option>
              <option value="Repurposed for Breakfast">Repurposed for Breakfast</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 800 }}>
              Save Daily Waste Entry
            </button>
          </div>
        </form>
      </div>

      {/* 2. Excess Food Actions Grid: Donation & Repurposing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* NGO / Orphanage / Old Age Home Donation Box */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHeart style={{ color: '#10b981' }} /> Dispatch Excess Food to Orphanage / Old Age Home
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            For fresh, highly perishable surplus food that needs early consumption.
          </p>

          <form onSubmit={handleDonateFood} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Select NGO / Shelter Home</label>
              <select className="form-control-glass" value={donateOrg} onChange={(e) => setDonateOrg(e.target.value)}>
                {(DONATION_ORGANIZATIONS || [
                  'Hope NGO Orphanage',
                  'Sunshine Senior Care Old Age Home',
                  'Little Angels Children Home',
                  'Peace Elderly Care Shelter'
                ]).map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Donation Quantity (kg)</label>
              <input 
                type="number" 
                className="form-control-glass" 
                value={donatedKg} 
                onChange={(e) => setDonatedKg(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '0.65rem 1rem', fontWeight: 800 }}>
              ❤️ Dispatch Fresh Surplus to Shelter
            </button>
          </form>
        </div>

        {/* Repurpose Excess Food for Next Meal Box */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaRecycle style={{ color: '#8b5cf6' }} /> Repurpose Excess Food for Next Meal
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            For safe, longer-shelf-life surplus (e.g. Rice, Chappathi) to be reused in Dinner/Breakfast.
          </p>

          <form onSubmit={handleRepurposeFood} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Target Meal for Repurposing</label>
              <select className="form-control-glass" value={repurposeTargetMeal} onChange={(e) => setRepurposeTargetMeal(e.target.value)}>
                {(REPURPOSE_MEAL_OPTIONS || ['Dinner', 'Breakfast', 'Snacks']).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Quantity to Repurpose (kg)</label>
              <input 
                type="number" 
                className="form-control-glass" 
                value={repurposedKg} 
                onChange={(e) => setRepurposedKg(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: '#fff', padding: '0.65rem 1rem', fontWeight: 800 }}>
              🔄 Schedule Food for Next Meal
            </button>
          </form>
        </div>

      </div>

      {/* 3. Detailed Waste & Disposition History Log Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClipboardList style={{ color: 'var(--primary)' }} /> Waste Logs & Disposition History
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Menu Item</th>
                <th>Cooked / Diners</th>
                <th>Pre- / Post-Waste</th>
                <th>Reusable vs Non-Reusable</th>
                <th>Disposition / Action</th>
              </tr>
            </thead>
            <tbody>
              {wasteLogs.map(log => {
                const totalW = (log.preConsumerWaste || 0) + (log.postConsumerWaste || 0);
                const reusable = typeof log.reusableWaste === 'number' ? log.reusableWaste : Math.round((log.preConsumerWaste || 0) * 0.7);
                const nonReusable = typeof log.nonReusableWaste === 'number' ? log.nonReusableWaste : (totalW - reusable);

                let statusBadge = (
                  <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    Disposed
                  </span>
                );

                if (log.dispositionStatus === 'Donated to NGO') {
                  statusBadge = (
                    <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaHeart /> {log.organizationName || 'Donated to NGO'}
                    </span>
                  );
                } else if (log.dispositionStatus && log.dispositionStatus.startsWith('Repurposed')) {
                  statusBadge = (
                    <span style={{ background: 'rgba(139, 92, 246, 0.18)', color: '#8b5cf6', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaRecycle /> {log.dispositionStatus}
                    </span>
                  );
                }

                return (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td><span className="badge-glass">{log.meal}</span></td>
                    <td style={{ fontWeight: 700 }}>{log.menuItem}</td>
                    <td>{log.cookedMeals} / {log.actualDiners}</td>
                    <td>{log.preConsumerWaste} kg / {log.postConsumerWaste} kg</td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>{reusable} kg Reusable</span>
                      <br />
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>{nonReusable} kg Non-Reusable</span>
                    </td>
                    <td>{statusBadge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
});

export default AdminWasteTab;
