import React, { memo } from 'react';
import { FaUserPlus, FaUsers, FaTrashAlt, FaKey, FaShieldAlt, FaBuilding, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { BOYS_HOSTELS, GIRLS_HOSTELS } from '../../config/constants';

const AdminUsersTab = memo(function AdminUsersTab({ adminHook }) {
  const {
    usersList,
    newStudentEmail,
    setNewStudentEmail,
    newStudentName,
    setNewStudentName,
    newStudentHostel,
    setNewStudentHostel,
    newStudentSection,
    setNewStudentSection,
    editingUserId,
    setEditingUserId,
    editUserEmail,
    setEditUserEmail,
    editUserName,
    setEditUserName,
    editUserHostel,
    setEditUserHostel,
    editUserSection,
    setEditUserSection,
    handleCreateStudentAccount,
    handleUpdateUserAccount,
    handleDeleteUserAccount
  } = adminHook;

  const currentHostelOptions = newStudentSection === 'Girls' ? GIRLS_HOSTELS : BOYS_HOSTELS;
  const editHostelOptions = editUserSection === 'Girls' ? GIRLS_HOSTELS : BOYS_HOSTELS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Create New Student Account Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUserPlus style={{ color: 'var(--primary)' }} /> Provision Student Credentials (@bitsathy.ac.in)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Public self-registration is disabled. Only Mess Administrators can create student accounts.
        </p>

        <div style={{ padding: '0.75rem 1rem', background: 'rgba(0, 82, 212, 0.08)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaKey style={{ color: 'var(--primary)' }} />
          <span>Initial Default Password: <code style={{ color: 'var(--primary)', fontWeight: 800, background: 'rgba(255,255,255,0.6)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>studentpassword</code></span>
        </div>

        <form onSubmit={handleCreateStudentAccount} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
            <label style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'flex-end', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
              Student Email (@bitsathy.ac.in)
            </label>
            <input
              type="email"
              className="form-control-glass"
              placeholder="e.g. 221cs101@bitsathy.ac.in"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
            <label style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'flex-end', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
              Student Full Name
            </label>
            <input
              type="text"
              className="form-control-glass"
              placeholder="e.g. Ramesh Kumar"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
            <label style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'flex-end', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
              Mess Section
            </label>
            <select
              className="form-control-glass"
              value={newStudentSection}
              onChange={(e) => {
                const sec = e.target.value;
                setNewStudentSection(sec);
                setNewStudentHostel(sec === 'Girls' ? GIRLS_HOSTELS[0] : BOYS_HOSTELS[0]);
              }}
            >
              <option value="Boys">Boys Mess Section</option>
              <option value="Girls">Girls Mess Section</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
            <label style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'flex-end', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
              Hostel Block ({newStudentSection})
            </label>
            <select
              className="form-control-glass"
              value={newStudentHostel}
              onChange={(e) => setNewStudentHostel(e.target.value)}
            >
              {currentHostelOptions.map(h => (
                <option key={h} value={h}>{h} Hostel</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', gap: '0.5rem' }}>
              <FaUserPlus /> Provision Student Account
            </button>
          </div>
        </form>
      </div>

      {/* User Accounts Management Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUsers style={{ color: 'var(--primary)' }} /> Registered Student Accounts ({usersList.length})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Email / Roll No</th>
                <th>Role</th>
                <th>Hostel Block</th>
                <th>Mess Section</th>
                <th>Account Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => {
                const isEditing = editingUserId === u.id;
                return (
                  <tr key={u.id}>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control-glass"
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          placeholder="Student Name"
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar-bubble">
                            {u.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</span>
                        </div>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="email"
                          className="form-control-glass"
                          value={editUserEmail}
                          onChange={(e) => setEditUserEmail(e.target.value)}
                          placeholder="student@bitsathy.ac.in"
                        />
                      ) : (
                        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {u.rollNo}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-info'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {u.role === 'admin' && <FaShieldAlt size={10} />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          className="form-control-glass"
                          value={editUserHostel}
                          onChange={(e) => setEditUserHostel(e.target.value)}
                        >
                          {editHostelOptions.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FaBuilding style={{ color: 'var(--text-muted)' }} /> {u.hostel}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          className="form-control-glass"
                          value={editUserSection}
                          onChange={(e) => {
                            const sec = e.target.value;
                            setEditUserSection(sec);
                            setEditUserHostel(sec === 'Girls' ? GIRLS_HOSTELS[0] : BOYS_HOSTELS[0]);
                          }}
                        >
                          <option value="Boys">Boys</option>
                          <option value="Girls">Girls</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.section === 'Boys' ? 'badge-info' : u.section === 'Girls' ? 'badge-warning' : 'badge-secondary'}`}>
                          {u.section} Mess
                        </span>
                      )}
                    </td>

                    <td>
                      {u.role === 'admin' || u.rollNo === 'admin1' ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontStyle: 'italic' }}>Primary Admin</span>
                      ) : isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                            onClick={() => handleUpdateUserAccount(u.id)}
                          >
                            <FaSave /> Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                            onClick={() => setEditingUserId(null)}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                            onClick={() => {
                              setEditingUserId(u.id);
                              setEditUserName(u.name);
                              setEditUserEmail(u.rollNo);
                              setEditUserSection(u.section || 'Boys');
                              setEditUserHostel(u.hostel || 'Sapphire');
                            }}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem', boxShadow: '0 2px 8px rgba(255, 65, 108, 0.25)' }}
                            onClick={() => handleDeleteUserAccount(u.id, u.name)}
                          >
                            <FaTrashAlt /> Delete
                          </button>
                        </div>
                      )}
                    </td>
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

export default AdminUsersTab;
