'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface WithAuthOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requiredRoles = [], redirectTo = '/auth' } = options;

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, loading, isAuthenticated, hasRole } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (loading) return;

      if (!isAuthenticated) {
        window.location.href = redirectTo;
        return;
      }

      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        // User doesn't have required role
        console.log(
          `Access denied: User role ${user?.role} cannot access this page`
        );

        // Show error message or redirect to appropriate dashboard
        alert(
          'You must be logged in with the correct role to access this page'
        );

        // Redirect to user's appropriate dashboard
        const dashboardUrl = getDashboardUrl(user?.role || 'STUDENT');
        window.location.href = dashboardUrl;
        return;
      }

      setIsAuthorized(true);
    }, [loading, isAuthenticated, user]);

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

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Checking permissions...
            </h2>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthenticatedComponent;
}

// Convenience HOCs for specific roles
export const withAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['ADMIN'] });

export const withTeacherAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['TEACHER', 'ADMIN'] });

export const withStudentAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) =>
  withAuth(WrappedComponent, {
    requiredRoles: ['STUDENT', 'TEACHER', 'ADMIN'],
  });
