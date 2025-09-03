import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? undefined } : null);
      setIsLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? undefined } : null);
    });

    init();
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmailPassword = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, []);

  const signUpWithEmailPassword = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { 
          error: null, 
          message: "Conta criada! Se não foi redirecionado automaticamente, verifique seu email para confirmar a conta." 
        };
      }
      
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      return { error: error?.message };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      // Clear local data and force navigation to login to avoid stuck session UI
      try { localStorage.removeItem('workout_history'); } catch {}
      // Clear any admin session flag
      try {
        const email = supabase.auth.getUser().then(r=>r.data.user?.email).catch(()=>undefined);
      } catch {}
      window.location.href = '/login';
    }
  }, []);

  const value: AuthContextValue = {
    isLoading,
    isAuthenticated: Boolean(user),
    user,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

