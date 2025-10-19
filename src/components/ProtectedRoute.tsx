import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

function isAuthenticated() {
  // Deprecated: now handled by backend cookie
  return null;
}

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('/api/auth?action=me', { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const path = window.location.pathname;
      if (!user) {
        toast({
          title: 'Unauthorized',
          description:
            'You must be logged in with the correct role to access the dashboard.',
          variant: 'destructive',
        });
        setRedirect('/auth?from=protected');
        return;
      }
      if (path.startsWith('/admin/dashboard') && user.role !== 'ADMIN') {
        toast({
          title: 'Unauthorized',
          description:
            'You must be logged in with the correct role to access the dashboard.',
          variant: 'destructive',
        });
        setRedirect(
          user.role === 'ADMIN'
            ? '/admin/dashboard'
            : user.role === 'TEACHER'
            ? '/teacher/dashboard'
            : '/student/dashboard'
        );
        return;
      }
      if (path.startsWith('/teacher/dashboard') && user.role !== 'TEACHER') {
        toast({
          title: 'Unauthorized',
          description:
            'You must be logged in with the correct role to access the dashboard.',
          variant: 'destructive',
        });
        setRedirect(
          user.role === 'ADMIN'
            ? '/admin/dashboard'
            : user.role === 'TEACHER'
            ? '/teacher/dashboard'
            : '/student/dashboard'
        );
        return;
      }
      if (path.startsWith('/student/dashboard') && user.role !== 'STUDENT') {
        toast({
          title: 'Unauthorized',
          description:
            'You must be logged in with the correct role to access the dashboard.',
          variant: 'destructive',
        });
        setRedirect(
          user.role === 'ADMIN'
            ? '/admin/dashboard'
            : user.role === 'TEACHER'
            ? '/teacher/dashboard'
            : '/student/dashboard'
        );
        return;
      }
    }
  }, [loading, user, toast]);

  if (loading) return null;
  if (redirect) return <Navigate to={redirect} replace />;
  return children;
}
