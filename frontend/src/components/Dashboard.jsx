import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckSquare, Clock, AlertTriangle, BarChart2 } from 'lucide-react';

export default function Dashboard({ todos }) {
  const { user, logout } = useAuth();

  // Statistics calculations
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const lowPriority = todos.filter(t => t.priority === 'low' && !t.completed).length;
  const mediumPriority = todos.filter(t => t.priority === 'medium' && !t.completed).length;
  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* User profile panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={24} color="var(--secondary)" />
          </div>
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
          <button 
            onClick={logout}
            className="btn-secondary"
            style={{ padding: '10px', borderRadius: '10px' }}
            title="Log Out"
          >
            <LogOut size={16} color="var(--high-priority)" />
          </button>
        </div>
      </div>

      {/* Completion rate progress circle/bar */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Progress</h3>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{completionRate}%</span>
        </div>
        
        {/* Progress bar container */}
        <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '5px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${completionRate}%`, 
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
              borderRadius: '5px',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {completed} of {total} tasks completed
        </p>
      </div>

      {/* Main stats summary grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--low-priority)' }}>
            <CheckSquare size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Completed</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{completed}</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pending</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{pending}</span>
        </div>
      </div>

      {/* Active priority counts */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={16} color="var(--primary)" />
          Pending Breakdown
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* High Priority */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--high-priority)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>High Priority</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--high-priority)' }}>{highPriority}</span>
          </div>

          {/* Medium Priority */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--medium-priority)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Medium Priority</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--medium-priority)' }}>{mediumPriority}</span>
          </div>

          {/* Low Priority */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--low-priority)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Low Priority</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--low-priority)' }}>{lowPriority}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
