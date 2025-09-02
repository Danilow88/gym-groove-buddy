import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export type ExerciseVideoRecord = {
  id: string;
  exercise_id: string;
  video_url: string | null;
  storage_path: string | null;
  uploaded_by: string;
  created_at: string;
};

export function useExerciseVideos() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<ExerciseVideoRecord[]>([]);

  const videoMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of videos) {
      if (v.video_url) map[v.exercise_id] = v.video_url;
      else if (v.storage_path) {
        const { data } = supabase.storage.from('exercise-videos').getPublicUrl(v.storage_path);
        if (data && data.publicUrl) map[v.exercise_id] = data.publicUrl;
      }
    }
    return map;
  }, [videos]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('exercise_videos').select('*');
      if (error) throw error;
      setVideos(data as ExerciseVideoRecord[]);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const setExternalUrl = useCallback(async (exerciseId: string, url: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    const { data, error } = await supabase
      .from('exercise_videos')
      .upsert({ exercise_id: exerciseId, video_url: url, storage_path: null, uploaded_by: user.id }, { onConflict: 'exercise_id' })
      .select('*')
      .single();
    if (error) throw error;
    setVideos((prev) => {
      const filtered = prev.filter(v => v.exercise_id !== exerciseId);
      return [data as ExerciseVideoRecord, ...filtered];
    });
  }, [user]);

  const uploadFile = useCallback(async (exerciseId: string, file: File) => {
    if (!user) throw new Error('Usuário não autenticado');

    const ext = file.name.split('.').pop() || 'mp4';
    const path = `${exerciseId}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('exercise-videos')
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type || 'video/mp4'
      });
    if (upErr) throw upErr;

    const { data: publicUrlData } = supabase.storage.from('exercise-videos').getPublicUrl(path);
    const publicUrl = publicUrlData?.publicUrl || null;

    const { data, error } = await supabase
      .from('exercise_videos')
      .upsert({ exercise_id: exerciseId, storage_path: path, video_url: publicUrl, uploaded_by: user.id }, { onConflict: 'exercise_id' })
      .select('*')
      .single();
    if (error) throw error;
    setVideos((prev) => {
      const filtered = prev.filter(v => v.exercise_id !== exerciseId);
      return [data as ExerciseVideoRecord, ...filtered];
    });
    return publicUrl;
  }, [user]);

  const removeVideo = useCallback(async (exerciseId: string) => {
    // Fetch existing to delete file if present
    const existing = videos.find(v => v.exercise_id === exerciseId);
    if (existing?.storage_path) {
      await supabase.storage.from('exercise-videos').remove([existing.storage_path]);
    }
    const { error } = await supabase.from('exercise_videos').delete().eq('exercise_id', exerciseId);
    if (error) throw error;
    setVideos(prev => prev.filter(v => v.exercise_id !== exerciseId));
  }, [videos]);

  const getUrlForExercise = useCallback((exerciseId: string, fallback?: string) => {
    return videoMap[exerciseId] || fallback || '';
  }, [videoMap]);

  return {
    loading,
    error,
    videos,
    videoMap,
    loadAll,
    setExternalUrl,
    uploadFile,
    removeVideo,
    getUrlForExercise,
  };
}

