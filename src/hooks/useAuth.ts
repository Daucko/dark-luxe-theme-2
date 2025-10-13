import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user from API
      // The HTTP-only cookie will be sent automatically with the request
      const response = await axios.get('/api/auth?action=me', {
        withCredentials: true, // Important: ensures cookies are sent with the request
      });

      setUser(response.data.user);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.error || 'Failed to fetch user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};
