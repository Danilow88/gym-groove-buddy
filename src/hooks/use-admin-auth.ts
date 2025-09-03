import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const { user } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'yaraka78@gmail.com';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'dedunha571';

  // Check if user is admin and restore per-user admin session
  useEffect(() => {
    if (!user?.email) {
      setIsAdminUser(false);
      setIsAdminAuthenticated(false);
      return;
    }
    const isAdmin = user.email === adminEmail;
    setIsAdminUser(isAdmin);
    // Namespaced key by email to avoid leaking admin across accounts
    const stored = localStorage.getItem(`admin_authenticated:${user.email}`);
    setIsAdminAuthenticated(isAdmin && stored === 'true');
  }, [user?.email, adminEmail]);

  const authenticateAdmin = useCallback((password: string): boolean => {
    if (password === adminPassword && isAdminUser && user?.email) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(`admin_authenticated:${user.email}`, 'true');
      return true;
    }
    return false;
  }, [adminPassword, isAdminUser, user?.email]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    if (user?.email) localStorage.removeItem(`admin_authenticated:${user.email}`);
  }, [user?.email]);

  return {
    isAdminUser,
    isAdminAuthenticated: isAdminUser && isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin
  };
}
