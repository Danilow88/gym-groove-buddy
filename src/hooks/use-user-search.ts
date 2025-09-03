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
      // Search only in profiles table since we can't access auth.users directly
      const { data: profiles, error: e2 } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .or(`full_name.ilike.%${query}%`)
        .limit(10);

      if (e2) {
        console.error('Error searching users:', e2);
        setUsers([]);
        return;
      }

      const profileMapped: UserProfile[] = (profiles ?? [])
        .map((p: any) => ({ id: p.user_id, full_name: p.full_name ?? null }))
        .filter((u) => Boolean(u.id));

      setUsers(profileMapped);
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
