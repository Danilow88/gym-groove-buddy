import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "./use-admin-auth";
import { useAuth } from "./use-auth";

export interface MobilityExercise {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  difficulty?: "easy" | "medium" | "hard";
  created_at: string;
}

export function useMobility() {
  const { isAdminAuthenticated } = useAdminAuth();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MobilityExercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  const defaultExercises: MobilityExercise[] = [
    {
      id: 'local-hip-5min',
      title: 'Mobilidade de Quadril (5 min)',
      description: 'Sequência rápida para soltar quadril e lombar.',
      video_url: 'https://www.youtube.com/watch?v=BkS1-El_WlE',
      difficulty: 'easy',
      created_at: new Date().toISOString(),
    },
    {
      id: 'local-ombros-bastao',
      title: 'Mobilidade de Ombros com Bastão',
      description: 'Melhora a amplitude e reduz rigidez em ombros.',
      video_url: 'https://www.youtube.com/watch?v=3sEeVJEXTfY',
      difficulty: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'local-posterior-dinamico',
      title: 'Alongamento Dinâmico de Pernas',
      description: 'Fluxo dinâmico para posterior, glúteos e panturrilhas.',
      video_url: 'https://www.youtube.com/watch?v=mhF3Z67f4xA',
      difficulty: 'easy',
      created_at: new Date().toISOString(),
    },
    {
      id: 'local-toracica',
      title: 'Abertura de Coluna Torácica',
      description: 'Mobilidade torácica para postura e supino.',
      video_url: 'https://www.youtube.com/watch?v=hxJdZrKk0nE',
      difficulty: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'local-tornozelo',
      title: 'Mobilidade de Tornozelo',
      description: 'Melhora a dorsiflexão para agachamento.',
      video_url: 'https://www.youtube.com/watch?v=K3VJ2UqoJbE',
      difficulty: 'easy',
      created_at: new Date().toISOString(),
    },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("mobility_exercises")
        .select("id, title, description, video_url, difficulty, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data as MobilityExercise[]) || [];
      if (rows.length === 0) {
        setItems(defaultExercises);
      } else {
        setItems(rows);
      }
    } catch (err) {
      // fallback para defaults se a tabela não existir ainda
      setItems(defaultExercises);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (payload: { title: string; description?: string; video_url?: string; difficulty?: MobilityExercise["difficulty"] }) => {
    if (!isAdminAuthenticated || !user?.id) return { error: "not_admin" };
    const { error } = await supabase.from("mobility_exercises").insert([
      { ...payload, created_by: user.id }
    ] as any);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [isAdminAuthenticated, user?.id, load]);

  const remove = useCallback(async (id: string) => {
    if (!isAdminAuthenticated) return { error: "not_admin" };
    const { error } = await supabase.from("mobility_exercises").delete().eq("id", id);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [isAdminAuthenticated, load]);

  return { loading, error, items, reload: load, create, remove };
}

