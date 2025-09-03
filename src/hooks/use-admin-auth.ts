import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const { user } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'yaraka78@gmail.com');
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'dedunha571';

  // Check if user is admin and restore per-user admin session
  useEffect(() => {
    if (!user?.email) {
      setIsAdminUser(false);
      setIsAdminAuthenticated(false);
      return;
    }
    const normalizedUserEmail = String(user.email).trim().toLowerCase();
    const normalizedAdminEmail = String(adminEmail).trim().toLowerCase();
    const forced = localStorage.getItem(`force_admin:${normalizedUserEmail}`) === 'true';
    const isEmailMatchAdmin = normalizedUserEmail === normalizedAdminEmail;
    const isAdminByLocal = forced || isEmailMatchAdmin;
    setIsAdminUser(isAdminByLocal);
    const stored = localStorage.getItem(`admin_authenticated:${normalizedUserEmail}`);
    setIsAdminAuthenticated(isAdminByLocal && stored === 'true');
  }, [user?.email, adminEmail]);

  // Verify against Supabase admin_configs for robustness (do not require is_active to avoid schema drift)
  useEffect(() => {
    let isMounted = true;
    async function verifyWithDatabase() {
      if (!user?.email) return;
      try {
        const email = String(user.email).trim().toLowerCase();
        const { data, error } = await supabase
          .from('admin_configs')
          .select('admin_email')
          .eq('admin_email', email)
          .maybeSingle();

        if (!isMounted) return;
        if (!error && data) {
          setIsAdminUser(true);
        }
      } catch {
        // No-op: fall back to local checks above
      }
    }
    verifyWithDatabase();
    return () => { isMounted = false; };
  }, [user?.email]);

  const authenticateAdmin = useCallback((password: string): boolean => {
    if (password === adminPassword && user?.email) {
      const emailKey = String(user.email).trim().toLowerCase();
      localStorage.setItem(`force_admin:${emailKey}`, 'true');
      localStorage.setItem(`admin_authenticated:${emailKey}`, 'true');
      setIsAdminUser(true);
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  }, [adminPassword, user?.email]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    if (user?.email) {
      const emailKey = String(user.email).trim().toLowerCase();
      localStorage.removeItem(`admin_authenticated:${emailKey}`);
      localStorage.removeItem(`force_admin:${emailKey}`);
    }
  }, [user?.email]);

  return {
    isAdminUser,
    isAdminAuthenticated: isAdminUser && isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin
  };
}
