import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';

export default function TodoList({ todos, onCreate, onUpdate, onDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  // Filters & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
      dueDate: dueDate || null
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setShowAddForm(false);
  };

  // Filter and Sort Logic
  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'completed' && todo.completed) || 
        (statusFilter === 'pending' && !todo.completed);

      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search and Filters panel */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ flexShrink: 0, padding: '12px 18px' }}
          >
            <Plus size={20} />
            <span className="hide-mobile">Add Task</span>
          </button>
        </div>

        {/* Filters and sorting Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select 
                className="glass-input" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '6px 28px 6px 12px', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select 
                className="glass-input" 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{ padding: '6px 28px 6px 12px', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="var(--text-secondary)" />
            <select 
              className="glass-input" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '6px 28px 6px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Highest Priority</option>
            </select>
          </div>

        </div>
      </div>

      {/* Add Task Expandable Form */}
      {showAddForm && (
        <form 
          onSubmit={handleSubmit} 
          className="glass-panel animate-fade-in" 
          style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--primary)' }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Task</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Task Title</label>
            <input
              type="text"
              className="glass-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Description (Optional)</label>
            <textarea
              className="glass-input"
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Priority</label>
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
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Due Date (Optional)</label>
              <input
                type="date"
                className="glass-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      )}

      {/* Todo items listing */}
      <div style={{ minHeight: '200px' }}>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: 'var(--text-secondary)',
              borderStyle: 'dashed',
              borderWidth: '2px'
            }}
          >
            <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>No tasks found matching your filters.</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>Try adjusting your search or add a new task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
