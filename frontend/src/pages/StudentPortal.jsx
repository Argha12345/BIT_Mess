import React, { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaRegStar,
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaVoteYea,
  FaCheck,
  FaClock
} from 'react-icons/fa';
import { api } from '@/api';


export default function StudentPortal({ user }) {
  const [activeTab, setActiveTab] = useState('polls');
  const [menuItems, setMenuItems] = useState([]);
  const [polls, setPolls] = useState([]);
  
  // Feedback Form state
  const [selectedMealId, setSelectedMealId] = useState('');
  const [mealRating, setMealRating] = useState(5);
  const [mealComment, setMealComment] = useState('');

  // Late Plate Reservations state
  const [resDate, setResDate] = useState(new Date().toISOString().split('T')[0]);
  const [resMeal, setResMeal] = useState('Lunch');
  const [resReason, setResReason] = useState('Lab Class');
  const [myReservations, setMyReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);

  // Status/Alert state
  const [statusMsg, setStatusMsg] = useState(null);
  const [statusType, setStatusType] = useState('success');

  const showStatus = (msg, type = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const loadData = async () => {
    try {
      if (!user) return;
      
      const pollsRes = await api.polls.get(user.section).catch(() => []);
      setPolls(pollsRes);

      const menuRes = await api.menu.get(user.section).catch(() => []);
      setMenuItems(menuRes);

      const resRes = await api.reservations.getByStudent(user.rollNo).catch(() => []);
      setMyReservations(resRes);
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Vote for option
  const handleVote = async (pollId, optionId) => {
    try {
      await api.polls.vote(pollId, optionId, user.rollNo);
      loadData();
    } catch (err) {
      showStatus(err.message || 'Voting failed', 'danger');
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedMealId) {
      return showStatus('Please select a menu item to rate', 'danger');
    }

    try {
      const payload = {
        userId: user.id,
        rollNo: user.rollNo,
        name: user.name,
        section: user.section,
        mealId: selectedMealId,
        date: new Date().toISOString().split('T')[0],
        rating: mealRating,
        comment: mealComment
      };

      await api.waste.submitFeedback(payload);
      showStatus('Thank you for rating! Feedback saved.', 'success');
      setSelectedMealId('');
      setMealComment('');
      loadData();
    } catch (err) {
      showStatus(err.message || 'Feedback submission failed', 'danger');
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    if (!resDate || !resMeal || !resReason) {
      return showStatus('Please specify date, meal, and reason', 'danger');
    }

    // Basic date validation - prevent selecting past dates
    const selectedDate = new Date(resDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      return showStatus('Cannot reserve late plates for past dates', 'danger');
    }

    try {
      setResLoading(true);
      await api.reservations.create({
        rollNo: user.rollNo,
        date: resDate,
        meal: resMeal,
        reason: resReason
      });
      showStatus('Late plate request submitted for approval!', 'success');
      loadData();
    } catch (err) {
      showStatus(err.message || 'Failed to reserve late plate', 'danger');
    } finally {
      setResLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await api.reservations.updateStatus(id, 'cancelled');
      showStatus('Reservation cancelled successfully.', 'success');
      loadData();
    } catch (err) {
      showStatus(err.message || 'Failed to cancel reservation', 'danger');
    }
  };

  const activePolls = polls.filter(p => p.status === 'open');

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Alert Messaging Banner */}
      {statusMsg && (
        <div 
          className="glass-panel" 
          style={{ 
            borderColor: statusType === 'success' ? 'var(--color-success)' : 'var(--color-danger)', 
            background: statusType === 'success' ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 23, 68, 0.05)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '1rem', 
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.3s'
          }}
        >
          {statusType === 'success' ? <FaCheckCircle size={18} style={{ color: 'var(--color-success)' }} /> : <FaExclamationTriangle size={18} style={{ color: 'var(--color-danger)' }} />}
          <p style={{ fontSize: '0.9rem' }}>{statusMsg}</p>
        </div>
      )}

      {/* Tabs Control Row */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.5rem', gap: '0.75rem' }}>
        <button 
          onClick={() => setActiveTab('polls')}
          className="btn"
          style={{
            background: activeTab === 'polls' ? 'rgba(0, 210, 255, 0.12)' : 'transparent',
            borderBottom: activeTab === 'polls' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'polls' ? 'var(--primary)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}
        >
          <FaVoteYea size={14} /> Food Change Polls
        </button>

        <button 
          onClick={() => setActiveTab('feedback')}
          className="btn"
          style={{
            background: activeTab === 'feedback' ? 'rgba(0, 210, 255, 0.12)' : 'transparent',
            borderBottom: activeTab === 'feedback' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'feedback' ? 'var(--primary)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}
        >
          <FaStar size={14} /> Menu Rating & Feedback
        </button>

        <button 
          onClick={() => setActiveTab('late-plate')}
          className="btn"
          style={{
            background: activeTab === 'late-plate' ? 'rgba(0, 210, 255, 0.12)' : 'transparent',
            borderBottom: activeTab === 'late-plate' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'late-plate' ? 'var(--primary)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}
        >
          <FaClock size={14} /> Late Plate Reservation
        </button>
      </div>

      {/* TAB 1: FOOD POLLS */}
      {activeTab === 'polls' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', fontFamily: 'var(--font-title)' }}>
              Active Food Alteration Polls ({user.section} Mess)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              The Mess Supervisor posts polls for proposed food changes 1 week in advance. Cast your vote for the dish you prefer. You can select one option, and changing your selection switches your vote.
            </p>
          </div>

          {activePolls.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <FaVoteYea size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No active food change polls open for voting at this time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {activePolls.map(poll => {
                // Calculate total votes cast in this poll
                const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes ? opt.votes.length : 0), 0);

                return (
                  <div key={poll.id} className="glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                          {poll.meal}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                          Poll for {new Date(poll.targetDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Votes</span>
                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{totalVotes}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {poll.options.map(opt => {
                        const hasVoted = opt.votes && opt.votes.includes(user.rollNo);
                        const votePercent = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;

                        return (
                          <div 
                            key={opt.id}
                            onClick={() => handleVote(poll.id, opt.id)}
                            style={{
                              position: 'relative',
                              padding: '0.85rem 1.25rem',
                              background: hasVoted ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid',
                              borderColor: hasVoted ? 'var(--primary)' : 'var(--border-glass)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              overflow: 'hidden',
                              transition: 'all 0.25s ease',
                              boxShadow: hasVoted ? 'var(--shadow-primary-glow)' : 'none'
                            }}
                          >
                            {/* Visual Vote Percentage Fill */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              width: `${votePercent}%`,
                              background: hasVoted ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.015)',
                              zIndex: 0,
                              transition: 'width 0.5s ease-out'
                            }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: `2px solid ${hasVoted ? 'var(--primary)' : 'var(--text-muted)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: hasVoted ? 'var(--primary)' : 'transparent'
                              }}>
                                {hasVoted && <FaCheck size={10} style={{ color: '#050a0c' }} />}
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: hasVoted ? 'var(--primary)' : 'var(--text-primary)' }}>
                                {opt.name}
                              </span>
                            </div>

                            <span style={{ fontSize: '0.85rem', fontWeight: 700, zIndex: 1 }}>
                              {opt.votes.length} votes ({votePercent}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FEEDBACK & RATING */}
      {activeTab === 'feedback' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-panel">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'var(--font-title)', textAlign: 'center' }}>
            Rate Recent Meal Menu ({user.section} Mess)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Low ratings correlate with higher plate waste. Mess supervisors use feedback trends to update/replace items.
          </p>

          <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Select Menu Item to Rate
              </label>
              <select 
                className="input-field" 
                value={selectedMealId}
                onChange={(e) => setSelectedMealId(e.target.value)}
                required
              >
                <option value="">-- Choose Menu Item --</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.day} - {item.meal}: {item.items.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Stars rating selectors */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Your Star Rating
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMealRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-warning)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {star <= mealRating ? (
                      <FaStar size={28} />
                    ) : (
                      <FaRegStar size={28} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Comments & Suggestions
              </label>
              <textarea 
                className="input-field" 
                rows={4}
                placeholder="Suggest recipe improvements (e.g. upma is dry, sambar needs more spice)"
                value={mealComment}
                onChange={(e) => setMealComment(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
              Submit Feedback
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LATE PLATE RESERVATIONS */}
      {activeTab === 'late-plate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Reservation Booking Form */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>
              Reserve Late Plate
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Classes or sports practice running late? Lock in your plate so the mess kitchen sets it aside for you.
            </p>

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Target Date
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Meal Period
                </label>
                <select 
                  className="input-field" 
                  value={resMeal}
                  onChange={(e) => setResMeal(e.target.value)}
                  required
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Reason for Late Plate
                </label>
                <select 
                  className="input-field" 
                  value={resReason}
                  onChange={(e) => setResReason(e.target.value)}
                  required
                >
                  <option value="Lab Class">Academic Lab Class</option>
                  <option value="Exam Preparation">Exam Study / Placement Drive</option>
                  <option value="Sports Practice">Sports / Club Practice</option>
                  <option value="Sick Leave">Sick / Medical reasons</option>
                  <option value="Travel / Outing">Late Travel / Official Outing</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={resLoading}
              >
                {resLoading ? 'Processing...' : 'Request Reservation'}
              </button>
            </form>
          </div>

          {/* List of my active reservations */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>
              My Reservations History
            </h3>

            {myReservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <FaClock size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem' }}>You have no active or past late plate bookings.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Meal</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Reason</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myReservations.map(res => {
                      let statusBadge = (
                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{res.status}</span>
                      );
                      if (res.status === 'pending') {
                        statusBadge = <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-warning)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Pending Approval</span>;
                      } else if (res.status === 'approved') {
                        statusBadge = <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Approved</span>;
                      } else if (res.status === 'rejected') {
                        statusBadge = <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Rejected</span>;
                      } else if (res.status === 'collected') {
                        statusBadge = <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>Collected</span>;
                      } else if (res.status === 'cancelled') {
                        statusBadge = <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)' }}>Cancelled</span>;
                      }

                      return (
                        <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{res.date}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{res.meal}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{res.reason || 'N/A'}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{statusBadge}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                            {['pending', 'approved'].includes(res.status) && (
                              <button 
                                onClick={() => handleCancelReservation(res.id)}
                                className="btn btn-secondary" 
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
