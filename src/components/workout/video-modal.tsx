import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  videoUrl: string;
  fallbackUrl?: string;
}

export function VideoModal({ isOpen, onClose, exerciseName, videoUrl, fallbackUrl }: VideoModalProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(videoUrl);
  const isYouTube = useMemo(() => currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be'), [currentUrl]);

  useEffect(() => {
    setCurrentUrl(videoUrl);
  }, [videoUrl]);

  const onPlayerError = () => {
    if (fallbackUrl && fallbackUrl !== currentUrl) {
      setCurrentUrl(fallbackUrl);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-card border-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{exerciseName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video bg-spotify-darker rounded-lg overflow-hidden">
            {isYouTube ? (
              <iframe
                src={currentUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={exerciseName}
                onError={onPlayerError}
              />
            ) : (
              <video
                src={currentUrl}
                controls
                className="w-full h-full object-cover"
                autoPlay
                onError={onPlayerError}
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Assista ao vídeo para aprender a técnica correta do exercício
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}