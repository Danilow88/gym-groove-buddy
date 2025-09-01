import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    muscle: string;
    description: string;
    videoUrl?: string;
    lastWeight?: number;
    lastReps?: number;
    lastSets?: number;
  };
  onAddSet: (exerciseId: string) => void;
  onPlayVideo: (exerciseId: string) => void;
  className?: string;
}

export function ExerciseCard({ exercise, onAddSet, onPlayVideo, className }: ExerciseCardProps) {
  return (
    <Card className={cn("bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-[1.02]", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">{exercise.name}</h3>
            <p className="text-sm text-spotify-green font-medium mb-1">{exercise.muscle}</p>
            <p className="text-xs text-muted-foreground">{exercise.description}</p>
          </div>
          {exercise.videoUrl && (
            <Button
              variant="default"
              size="icon"
              onClick={() => onPlayVideo(exercise.id)}
              className="ml-2 rounded-full bg-spotify-green text-white hover:bg-spotify-green-hover shadow-spotify"
              aria-label="Assistir vídeo do exercício"
              title="Assistir vídeo"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {(exercise.lastWeight || exercise.lastReps || exercise.lastSets) && (
          <div className="bg-spotify-surface rounded-lg p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Última sessão:</p>
            <div className="flex gap-4 text-sm">
              {exercise.lastSets && <span>{exercise.lastSets} séries</span>}
              {exercise.lastReps && <span>{exercise.lastReps} reps</span>}
              {exercise.lastWeight && <span>{exercise.lastWeight}kg</span>}
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => onAddSet(exercise.id)}
          className="w-full bg-gradient-primary hover:bg-spotify-green-hover shadow-spotify transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Série
        </Button>
      </div>
    </Card>
  );
}