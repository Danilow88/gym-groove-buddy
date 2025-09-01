import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const { user } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => {
      // Verifica se já está autenticado no localStorage
      const stored = localStorage.getItem('admin_authenticated');
      return stored === 'true';
    }
  );
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'yaraka78@gmail.com';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'dedunha571';

  // Check if user is admin by checking against Supabase or fallback to env
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.email) {
        setIsAdminUser(false);
        return;
      }

      try {
        // Try to check admin status in Supabase profile or use email check
        const isAdmin = user.email === adminEmail;
        setIsAdminUser(isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Fallback to email check
        setIsAdminUser(user.email === adminEmail);
      }
    };

    checkAdminStatus();
  }, [user?.email, adminEmail]);

  const authenticateAdmin = useCallback((password: string): boolean => {
    if (password === adminPassword && isAdminUser) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  }, [adminPassword, isAdminUser]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  }, []);

  return {
    isAdminUser,
    isAdminAuthenticated: isAdminUser && isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin
  };
}
