import React, { memo, useState } from 'react';
import { FaBullhorn, FaPaperPlane, FaTrashAlt, FaBell, FaUsers } from 'react-icons/fa';

const AdminNotificationsTab = memo(function AdminNotificationsTab({ adminHook }) {
  const {
    selectedSection,
    notificationsList,
    handleSendNotification,
    handleDeleteNotification
  } = adminHook;

  const [message, setMessage] = useState('');
  const [targetSection, setTargetSection] = useState(selectedSection || 'Boys');
  const [targetStudent, setTargetStudent] = useState('All');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await handleSendNotification({
      section: targetSection,
      studentRollNo: targetStudent,
      message
    });
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Broadcast Notification Form Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaBullhorn style={{ color: 'var(--primary)' }} /> Broadcast Announcement to Student Notification Panel
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Send live alerts, menu updates, or urgent notices to students' top-header notification bells.
        </p>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Target Mess Section</label>
              <select
                className="form-control-glass"
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <option value="Boys">Boys Mess Section</option>
                <option value="Girls">Girls Mess Section</option>
                <option value="All">All Messes (Boys & Girls)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Recipients</label>
              <select
                className="form-control-glass"
                value={targetStudent}
                onChange={(e) => setTargetStudent(e.target.value)}
              >
                <option value="All">All Registered Students</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notification Message</label>
            <textarea
              className="form-control-glass"
              rows={3}
              placeholder="e.g. Special Sunday Chicken Biryani / Paneer Biryani served today at 12:30 PM. Please maintain mess decorum."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ alignSelf: 'flex-start' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', gap: '0.5rem' }}>
              <FaPaperPlane /> Broadcast Live Notification
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Log */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaBell style={{ color: 'var(--primary)' }} /> Sent Broadcast Announcements History ({notificationsList?.length || 0})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Target Section</th>
                <th>Recipients</th>
                <th>Message Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!notificationsList || notificationsList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No broadcast announcements sent yet.
                  </td>
                </tr>
              ) : (
                notificationsList.map(n => (
                  <tr key={n.id}>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge ${n.section === 'Boys' ? 'badge-info' : n.section === 'Girls' ? 'badge-warning' : 'badge-success'}`}>
                        {n.section}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{n.studentRollNo || 'All'}</td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{n.message}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', gap: '0.25rem' }}
                        onClick={() => handleDeleteNotification(n.id)}
                      >
                        <FaTrashAlt /> Delete
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

export default AdminNotificationsTab;
