import React, { useState } from 'react';
import { Trash2, Edit2, Calendar, Save, X, Check, Clock } from 'lucide-react';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  );

  const handleToggleComplete = () => {
    onUpdate(todo._id, { completed: !todo.completed });
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onUpdate(todo._id, {
      title,
      description,
      priority,
      dueDate: dueDate || null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  if (isEditing) {
    return (
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '4px solid var(--primary)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Title</label>
          <input
            type="text"
            className="glass-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Description</label>
          <textarea
            className="glass-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical', minHeight: '60px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Priority</label>
            <select
              className="glass-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Due Date</label>
            <input
              type="date"
              className="glass-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
          <button className="btn-secondary" onClick={handleCancel} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <X size={16} /> Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`glass-panel glass-panel-hover animate-fade-in`}
      style={{ 
        padding: '20px', 
        marginBottom: '16px', 
        display: 'flex', 
        gap: '16px',
        alignItems: 'flex-start',
        borderLeft: `4px solid ${
          todo.completed
            ? 'var(--text-muted)'
            : todo.priority === 'high'
            ? 'var(--high-priority)'
            : todo.priority === 'medium'
            ? 'var(--medium-priority)'
            : 'var(--low-priority)'
        }`,
        opacity: todo.completed ? 0.7 : 1
      }}
    >
      {/* Custom Checkbox */}
      <button 
        onClick={handleToggleComplete}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `2px solid ${todo.completed ? 'var(--text-muted)' : 'var(--primary)'}`,
          background: todo.completed ? 'var(--primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginTop: '2px',
          flexShrink: 0
        }}
      >
        {todo.completed && <Check size={14} color="#fff" strokeWidth={3} />}
      </button>

      {/* Todo Contents */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <h3 
          style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: todo.completed ? 'line-through' : 'none',
            wordBreak: 'break-word'
          }}
        >
          {todo.title}
        </h3>
        
        {todo.description && (
          <p 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              marginTop: '6px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              wordBreak: 'break-word'
            }}
          >
            {todo.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
          <span className={`priority-tag ${todo.priority}`}>
            {todo.priority}
          </span>

          {todo.dueDate && (
            <span 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '0.8rem', 
                color: isOverdue ? 'var(--high-priority)' : 'var(--text-secondary)',
                fontWeight: isOverdue ? 600 : 400
              }}
            >
              {isOverdue ? <Clock size={12} /> : <Calendar size={12} />}
              {formatDate(todo.dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {!todo.completed && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
        )}
        <button 
          onClick={() => onDelete(todo._id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px'
          }}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
