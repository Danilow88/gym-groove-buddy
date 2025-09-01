import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function RestTimer({ isOpen, onClose, duration = 90 }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(duration);
      setIsRunning(true);
    }
  }, [isOpen, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Tempo de Descanso</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="text-6xl font-bold text-spotify-green">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="bg-spotify-green hover:bg-spotify-green-hover"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <Square className="h-5 w-5" />
            </Button>
          </div>
          
          {timeLeft === 0 && (
            <p className="text-spotify-green font-semibold">Descanso finalizado!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}