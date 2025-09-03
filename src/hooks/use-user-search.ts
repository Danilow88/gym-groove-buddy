import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string | null;
}

export function useUserSearch() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_users', {
        search_term: query.trim()
      });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUsers = useCallback(() => {
    setUsers([]);
  }, []);

  return {
    users,
    loading,
    searchUsers,
    clearUsers
  };
}
