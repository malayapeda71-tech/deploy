import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import { CheckCircle2, Loader2 } from 'lucide-react';

function TodoAppContent() {
  const { user, token, loading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/todos`;

  // Fetch todos when user log in
  useEffect(() => {
    const fetchTodos = async () => {
      if (!token) return;
      setTodosLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch tasks');
        }
      } catch (error) {
        setErrorMessage('Network error: Could not reach the server');
        console.error('Error fetching todos:', error);
      } finally {
        setTodosLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  // Create new Todo
  const handleCreateTodo = async (todoData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos((prev) => [newTodo, ...prev]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Network error: Could not create task');
    }
  };

  // Update Todo (text, completion, priority, etc)
  const handleUpdateTodo = async (id, updateData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updatedTodo : todo))
        );
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Network error: Could not update task');
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Network error: Could not delete task');
    }
  };

  // Auth or app loading screen
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '16px' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Securing session...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not Authenticated view
  if (!user) {
    return <AuthForm />;
  }

  // Authenticated Dashboard view
  return (
    <div className="app-container">
      {/* Header section */}
      <header 
        className="glass-panel animate-fade-in" 
        style={{ 
          padding: '20px 30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}
          >
            <CheckCircle2 size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TaskFlow
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Premium Workspace
            </p>
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Welcome back, <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{user.username}</span>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="dashboard-grid">
        {/* Left Side: Stats and user profile */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Dashboard todos={todos} />
        </section>

        {/* Right Side: Tasks input and listing */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {errorMessage && (
            <div 
              style={{ 
                background: 'rgba(244, 63, 94, 0.1)', 
                border: '1px solid rgba(244, 63, 94, 0.2)', 
                color: 'var(--high-priority)', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}
            >
              {errorMessage}
            </div>
          )}
          
          {todosLoading ? (
            <div className="glass-panel" style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading workspace tasks...</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onCreate={handleCreateTodo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TodoAppContent />
    </AuthProvider>
  );
}
