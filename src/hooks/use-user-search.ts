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
      // Search in profiles table for real users and use user_id as the chat peer id
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name')
        .or(`full_name.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        setUsers([]);
        return;
      }

      const mapped: UserProfile[] = (profiles ?? [])
        .map((p: any) => ({ id: p.user_id, full_name: p.full_name ?? null }))
        // Filter out any entries missing a valid user_id
        .filter((u) => Boolean(u.id));

      setUsers(mapped);
    } catch (error) {
      console.error('Error searching users:', error);
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
