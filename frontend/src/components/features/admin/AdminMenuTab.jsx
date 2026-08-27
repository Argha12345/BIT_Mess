import React, { memo } from 'react';
import { FaUtensils, FaEdit, FaSave, FaStar, FaCoffee, FaMoon, FaSun, FaBreadSlice } from 'react-icons/fa';

const AdminMenuTab = memo(function AdminMenuTab({ adminHook }) {
  const {
    menuItems,
    editingMenuItem,
    setEditingMenuItem,
    editItemsText,
    setEditItemsText,
    editPopularity,
    setEditPopularity,
    handleUpdateMenuItem
  } = adminHook;

  const getMealIcon = (meal) => {
    switch (meal) {
      case 'Breakfast': return <FaSun style={{ color: '#f59e0b' }} />;
      case 'Lunch': return <FaUtensils style={{ color: '#10b981' }} />;
      case 'Snacks': return <FaCoffee style={{ color: '#8b5cf6' }} />;
      case 'Dinner': return <FaMoon style={{ color: '#00d2ff' }} />;
      default: return <FaBreadSlice style={{ color: 'var(--primary)' }} />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaUtensils style={{ color: 'var(--primary)' }} /> Weekly Mess Menu Schedule Management
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Meal</th>
              <th>Items Description</th>
              <th>Popularity Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => {
              const isEditing = editingMenuItem === item.id;
              const popPct = (item.popularity / 10) * 100;
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {item.day}
                  </td>
                  <td>
                    <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem' }}>
                      {getMealIcon(item.meal)} {item.meal}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control-glass"
                        value={editItemsText}
                        onChange={(e) => setEditItemsText(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      item.items
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-control-glass"
                        value={editPopularity}
                        onChange={(e) => setEditPopularity(e.target.value)}
                        style={{ width: '70px' }}
                      />
                    ) : (
                      <div className="popularity-bar-container">
                        <div className="popularity-bar-bg">
                          <div className="popularity-bar-fill" style={{ width: `${popPct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <FaStar style={{ color: '#f59e0b', fontSize: '0.75rem' }} /> {item.popularity}/10
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
                        onClick={() => handleUpdateMenuItem(item.id)}
                      >
                        <FaSave /> Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
                        onClick={() => {
                          setEditingMenuItem(item.id);
                          setEditItemsText(item.items);
                          setEditPopularity(item.popularity);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AdminMenuTab;
