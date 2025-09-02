import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useExerciseVideos } from "@/hooks/use-exercise-videos";
import { useEffect, useState } from "react";
import { Loader2, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  exerciseId: string;
  muscleGroup?: string;
}

export function VideoModal({ isOpen, onClose, exerciseName, exerciseId, muscleGroup }: VideoModalProps) {
  const { getVideoInfo, convertYouTubeUrl, getPlayerType } = useExerciseVideos();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [playerType, setPlayerType] = useState<'local' | 'youtube' | 'external'>('local');

  useEffect(() => {
    if (isOpen && exerciseId) {
      loadVideo();
    }
  }, [isOpen, exerciseId, muscleGroup]);

  const loadVideo = async () => {
    setIsLoading(true);
    setVideoError(false);
    
    try {
      const videoInfo = await getVideoInfo(exerciseId, muscleGroup);
      let finalUrl = videoInfo.url;
      
      const type = getPlayerType(finalUrl);
      if (type === 'youtube') {
        finalUrl = convertYouTubeUrl(finalUrl);
      }
      
      setVideoUrl(finalUrl);
      setIsLocal(videoInfo.isLocal);
      setPlayerType(type);
    } catch (error) {
      console.error('Error loading video:', error);
      setVideoError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const renderVideoPlayer = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
          <span className="ml-2 text-sm text-muted-foreground">Carregando vídeo...</span>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Não foi possível carregar o vídeo
          </p>
          <Button size="sm" onClick={loadVideo} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (playerType === 'youtube') {
      return (
        <iframe
          src={videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          title={exerciseName}
          onError={handleVideoError}
        />
      );
    }

    return (
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
        onError={handleVideoError}
        preload="metadata"
      >
        <p className="text-sm text-muted-foreground text-center">
          Seu navegador não suporta reprodução de vídeo.
        </p>
      </video>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-card border-border max-w-lg mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center flex-1">{exerciseName}</DialogTitle>
            <div className="flex items-center gap-1">
              {isLocal ? (
                <WifiOff className="h-4 w-4 text-spotify-green" title="Vídeo offline disponível" />
              ) : (
                <Wifi className="h-4 w-4 text-blue-500" title="Requer conexão com internet" />
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video bg-spotify-darker rounded-lg overflow-hidden">
            {renderVideoPlayer()}
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Assista ao vídeo para aprender a técnica correta do exercício
            </p>
            {isLocal && (
              <p className="text-xs text-spotify-green flex items-center justify-center gap-1">
                <WifiOff className="h-3 w-3" />
                Disponível offline
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}