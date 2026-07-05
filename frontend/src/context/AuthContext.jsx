import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('todo_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set API base URL
  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`;

  // Load user profile if token is present
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error loading user:', err);
        // Don't log out if it's a network error, just keep the token but stop loading
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register User
  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('todo_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email
      });
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Login User
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('todo_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email
      });
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('todo_token');
    setToken(null);
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
