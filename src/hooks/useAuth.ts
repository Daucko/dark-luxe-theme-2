'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthState({ user: null, loading: false, isAuthenticated: false });
        return;
      }

      const response = await fetch('/api/auth?action=me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        // Token is invalid
        localStorage.removeItem('auth_token');
        setAuthState({ user: null, loading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setAuthState({ user: null, loading: false, isAuthenticated: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        setAuthState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
        });

        // Redirect based on role using window.location for compatibility
        const dashboardUrl = getDashboardUrl(data.user.role);
        window.location.href = dashboardUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({ user: null, loading: false, isAuthenticated: false });
    window.location.href = '/auth';
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!authState.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(authState.user.role);
  };

  const getDashboardUrl = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEACHER':
        return '/teacher/dashboard';
      case 'STUDENT':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };

  return {
    ...authState,
    login,
    logout,
    hasRole,
    checkAuth,
  };
};
