import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export function useGetMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          if (response.status === 401) {
            setUser(null);
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
