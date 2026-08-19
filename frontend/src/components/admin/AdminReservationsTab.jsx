import React, { memo } from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';

const AdminReservationsTab = memo(function AdminReservationsTab({ adminHook }) {
  const {
    reservations,
    resDateFilter,
    setResDateFilter,
    resMealFilter,
    setResMealFilter,
    resStatusFilter,
    setResStatusFilter,
    handleUpdateReservationStatus
  } = adminHook;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClock style={{ color: 'var(--primary)' }} /> Student Late Plate Reservations Management
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input type="date" className="form-control-glass" value={resDateFilter} onChange={(e) => setResDateFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} />
          <select className="form-control-glass" value={resMealFilter} onChange={(e) => setResMealFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
          </select>
          <select className="form-control-glass" value={resStatusFilter} onChange={(e) => setResStatusFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="collected">Collected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Hostel</th>
              <th>Diet</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No reservations found for selected filters.
                </td>
              </tr>
            ) : (
              reservations.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 700 }}>{res.name}</td>
                  <td>{res.rollNo}</td>
                  <td>{res.hostel}</td>
                  <td>{res.messType}</td>
                  <td style={{ fontSize: '0.8rem' }}>{res.reason}</td>
                  <td>
                    <StatusBadge status={res.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {res.status === 'pending' && (
                        <>
                          <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => handleUpdateReservationStatus(res.id, 'approved')}>
                            <FaCheck /> Approve
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => handleUpdateReservationStatus(res.id, 'rejected')}>
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                      {res.status === 'approved' && (
                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => handleUpdateReservationStatus(res.id, 'collected')}>
                          Mark Collected
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AdminReservationsTab;
