import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, exerciseName, videoUrl }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-card border-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{exerciseName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video bg-spotify-darker rounded-lg overflow-hidden">
            {videoUrl.includes('youtube.com') ? (
              <iframe
                src={videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={exerciseName}
              />
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                autoPlay
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