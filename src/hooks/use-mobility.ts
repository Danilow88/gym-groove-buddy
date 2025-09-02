import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "./use-admin-auth";

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
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MobilityExercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("mobility_exercises")
        .select("id, title, description, video_url, difficulty, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data as MobilityExercise[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (payload: { title: string; description?: string; video_url?: string; difficulty?: MobilityExercise["difficulty"] }) => {
    if (!isAdminAuthenticated) return { error: "not_admin" };
    const { error } = await supabase.from("mobility_exercises").insert([payload]);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [isAdminAuthenticated, load]);

  const remove = useCallback(async (id: string) => {
    if (!isAdminAuthenticated) return { error: "not_admin" };
    const { error } = await supabase.from("mobility_exercises").delete().eq("id", id);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [isAdminAuthenticated, load]);

  return { loading, error, items, reload: load, create, remove };
}

