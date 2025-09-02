import { useState, useCallback } from 'react';
import { getVideoUrl, isLocalVideo, getGenericVideoByMuscleGroup, getExerciseVideo } from '@/data/exercise-videos';

export interface VideoInfo {
  url: string;
  isLocal: boolean;
  isAvailable: boolean;
  fallbackUrl?: string;
}

export function useExerciseVideos() {
  const [videoStatus, setVideoStatus] = useState<Record<string, VideoInfo>>({});

  // Função para verificar se um vídeo local está disponível
  const checkVideoAvailability = useCallback(async (videoUrl: string): Promise<boolean> => {
    if (!isLocalVideo(videoUrl)) return true; // Assume que vídeos online estão disponíveis
    
    try {
      const response = await fetch(videoUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log(`Video not available: ${videoUrl}`);
      return false;
    }
  }, []);

  // Função principal para obter informações do vídeo
  const getVideoInfo = useCallback(async (exerciseId: string, muscleGroup?: string): Promise<VideoInfo> => {
    // Verifica se já temos informações em cache
    if (videoStatus[exerciseId]) {
      return videoStatus[exerciseId];
    }

    const primaryUrl = getVideoUrl(exerciseId);
    let videoInfo: VideoInfo;

    if (primaryUrl) {
      const isLocal = isLocalVideo(primaryUrl);
      const isAvailable = await checkVideoAvailability(primaryUrl);

      if (isLocal && !isAvailable) {
        // Se o vídeo local não está disponível, tenta fallback
        const exerciseVideo = getExerciseVideo(exerciseId);
        const fallbackUrl = exerciseVideo?.fallbackVideoPath || 
                           (muscleGroup ? getGenericVideoByMuscleGroup(muscleGroup) : null) ||
                           exerciseVideo?.youtubeUrl;

        const fallbackAvailable = fallbackUrl ? await checkVideoAvailability(fallbackUrl) : false;
        
        videoInfo = {
          url: fallbackAvailable ? fallbackUrl! : primaryUrl,
          isLocal: fallbackUrl ? isLocalVideo(fallbackUrl) : isLocal,
          isAvailable: fallbackAvailable,
          fallbackUrl: fallbackUrl || undefined
        };
      } else {
        videoInfo = {
          url: primaryUrl,
          isLocal,
          isAvailable,
        };
      }
    } else {
      // Se não há vídeo específico, usa genérico baseado no grupo muscular
      const genericUrl = muscleGroup ? getGenericVideoByMuscleGroup(muscleGroup) : '/videos/exercises/generic-workout.mp4';
      const isAvailable = await checkVideoAvailability(genericUrl);
      
      videoInfo = {
        url: genericUrl,
        isLocal: isLocalVideo(genericUrl),
        isAvailable
      };
    }

    // Salva no cache
    setVideoStatus(prev => ({
      ...prev,
      [exerciseId]: videoInfo
    }));

    return videoInfo;
  }, [videoStatus, checkVideoAvailability]);

  // Função para obter URL do vídeo diretamente (com fallbacks automáticos)
  const getVideoUrlWithFallback = useCallback(async (exerciseId: string, muscleGroup?: string): Promise<string> => {
    const videoInfo = await getVideoInfo(exerciseId, muscleGroup);
    return videoInfo.url;
  }, [getVideoInfo]);

  // Função para verificar se há vídeo disponível para um exercício
  const hasVideoAvailable = useCallback(async (exerciseId: string, muscleGroup?: string): Promise<boolean> => {
    const videoInfo = await getVideoInfo(exerciseId, muscleGroup);
    return videoInfo.isAvailable;
  }, [getVideoInfo]);

  // Função para limpar cache de vídeos
  const clearVideoCache = useCallback(() => {
    setVideoStatus({});
  }, []);

  // Função para converter URL do YouTube para embed
  const convertYouTubeUrl = useCallback((url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  }, []);

  // Função para determinar o tipo de player necessário
  const getPlayerType = useCallback((videoUrl: string): 'local' | 'youtube' | 'external' => {
    if (isLocalVideo(videoUrl)) return 'local';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) return 'youtube';
    return 'external';
  }, []);

  return {
    getVideoInfo,
    getVideoUrlWithFallback,
    hasVideoAvailable,
    clearVideoCache,
    convertYouTubeUrl,
    getPlayerType,
    videoStatus
  };
}
