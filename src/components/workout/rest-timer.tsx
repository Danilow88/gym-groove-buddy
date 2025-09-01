import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw } from "lucide-react";

interface RestTimerProps {
  defaultSeconds?: number;
}

export function RestTimer({ defaultSeconds = 60 }: RestTimerProps) {
  const [duration, setDuration] = useState<number>(defaultSeconds);
  const [remaining, setRemaining] = useState<number>(defaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const progress = useMemo(() => {
    if (duration === 0) return 0;
    return Math.max(0, Math.min(100, (1 - remaining / duration) * 100));
  }, [duration, remaining]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const toggleRun = () => setIsRunning(prev => !prev);
  const reset = () => {
    setIsRunning(false);
    setRemaining(duration);
  };

  const onDurationChange = (value: number[]) => {
    const v = value[0] ?? defaultSeconds;
    setDuration(v);
    setRemaining(v);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <Card className="bg-spotify-card border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Descanso</p>
          <div className="text-2xl font-semibold text-foreground">{mm}:{ss}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-spotify-surface hover:bg-spotify-surface/80" onClick={reset} aria-label="Reiniciar">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" className="rounded-full bg-spotify-green hover:bg-spotify-green-hover" onClick={toggleRun} aria-label={isRunning ? "Pausar" : "Iniciar"}>
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mb-3 h-2 rounded-full bg-spotify-surface overflow-hidden">
        <div className="h-full bg-spotify-green transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Ajustar descanso (segundos)</p>
        <Slider value={[duration]} min={15} max={240} step={5} onValueChange={onDurationChange} />
      </div>
    </Card>
  );
}

