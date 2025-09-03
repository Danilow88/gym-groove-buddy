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
      // Try auth.users by email prefix
      const { data: byEmail, error: e1 } = await (supabase as any)
        .from('auth.users')
        .select('id, email')
        .ilike('email', `${query}%`)
        .limit(10);

      // Then profiles by name
      const { data: profiles, error: e2 } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .ilike('full_name', `%${query}%`)
        .limit(10);

      if (e1 && e2) {
        console.error('Error searching users:', e1 || e2);
        setUsers([]);
        return;
      }

      const emailMapped: UserProfile[] = (byEmail ?? []).map((u: any) => ({ id: u.id, email: u.email, full_name: null }));
      const profileMapped: UserProfile[] = (profiles ?? [])
        .map((p: any) => ({ id: p.user_id, full_name: p.full_name ?? null }))
        .filter((u) => Boolean(u.id));

      // Merge unique by id, prioritize email if present
      const map = new Map<string, UserProfile>();
      for (const u of [...emailMapped, ...profileMapped]) {
        map.set(u.id, { ...map.get(u.id), ...u } as UserProfile);
      }
      const mapped = Array.from(map.values());

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
