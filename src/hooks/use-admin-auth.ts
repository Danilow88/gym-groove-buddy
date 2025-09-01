import { useState, useCallback } from 'react';
import { useAuth } from './use-auth';

export function useAdminAuth() {
  const { user } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => {
      // Verifica se já está autenticado no localStorage
      const stored = localStorage.getItem('admin_authenticated');
      return stored === 'true';
    }
  );

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'yaraka78@gmail.com';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'dedunha571';
  
  const isAdminUser = user?.email === adminEmail;

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
