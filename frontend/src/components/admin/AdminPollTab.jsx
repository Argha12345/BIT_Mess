import React, { memo } from 'react';
import { FaVoteYea, FaPlus, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';

const AdminPollTab = memo(function AdminPollTab({ adminHook }) {
  const {
    polls,
    pollTargetDate,
    setPollTargetDate,
    pollMeal,
    setPollMeal,
    pollOption1,
    setPollOption1,
    pollOption2,
    setPollOption2,
    pollOption3,
    setPollOption3,
    handleCreatePoll,
    handleClosePoll,
    handleResolveTie,
    handleDeletePoll
  } = adminHook;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPlus style={{ color: 'var(--primary)' }} /> Create Food Change Student Voting Poll
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Publish menu options for students to vote on. Polls must be created at least 1 week prior to the target date.
        </p>
        <form onSubmit={handleCreatePoll} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Target Date</label>
            <input type="date" className="form-control-glass" value={pollTargetDate} onChange={(e) => setPollTargetDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Meal</label>
            <select className="form-control-glass" value={pollMeal} onChange={(e) => setPollMeal(e.target.value)}>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div className="form-group">
            <label>Option 1 (Required)</label>
            <input type="text" className="form-control-glass" placeholder="e.g. Masala Dosa" value={pollOption1} onChange={(e) => setPollOption1(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Option 2 (Required)</label>
            <input type="text" className="form-control-glass" placeholder="e.g. Chole Bhature" value={pollOption2} onChange={(e) => setPollOption2(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Option 3 (Optional)</label>
            <input type="text" className="form-control-glass" placeholder="e.g. Paneer Fried Rice" value={pollOption3} onChange={(e) => setPollOption3(e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Publish Voting Poll
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaVoteYea style={{ color: 'var(--primary)' }} /> Active & Past Voting Polls
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {polls.map(poll => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes ? opt.votes.length : 0), 0);
            return (
              <div key={poll.id} className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-info">{poll.targetDate} - {poll.meal}</span>
                  <StatusBadge status={poll.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {poll.options.map(opt => {
                    const voteCount = opt.votes ? opt.votes.length : 0;
                    const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    const isWinner = poll.winner === opt.name;
                    return (
                      <div key={opt.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: isWinner ? '1px solid var(--success)' : '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          <span>{opt.name} {isWinner && '🏆'}</span>
                          <span>{voteCount} votes ({percent}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: isWinner ? 'var(--success)' : 'var(--primary)' }} />
                        </div>
                        {poll.status === 'tie' && (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', marginTop: '0.5rem' }}
                            onClick={() => handleResolveTie(poll.id, opt.name)}
                          >
                            Declare Winner
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {poll.status === 'open' && (
                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleClosePoll(poll.id)}>
                      <FaCheckCircle /> Close & Calculate Winner
                    </button>
                  )}
                  <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleDeletePoll(poll.id)}>
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default AdminPollTab;
