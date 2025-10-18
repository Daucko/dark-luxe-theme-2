'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { authAPI, tokenManager } from '../lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  googleAuth: (googleData: any) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          tokenManager.removeToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData } = await authAPI.login(email, password);
      setUser(userData);

      // Redirect based on role
      const dashboardUrl = getDashboardUrl(userData.role);
      window.location.href = dashboardUrl;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string
  ) => {
    try {
      setLoading(true);
      const { user: userData } = await authAPI.register(
        email,
        password,
        name,
        role
      );
      setUser(userData);

      // Redirect based on role
      const dashboardUrl = getDashboardUrl(userData.role);
      window.location.href = dashboardUrl;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    authAPI.logout();
  };

  const googleAuth = async (googleData: any) => {
    try {
      setLoading(true);
      const { user: userData } = await authAPI.googleAuth(googleData);
      setUser(userData);

      // Redirect based on role
      const dashboardUrl = getDashboardUrl(userData.role);
      window.location.href = dashboardUrl;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
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

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    googleAuth,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
