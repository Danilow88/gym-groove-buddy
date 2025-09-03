import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CountdownTimerProps {
  label: string;
  defaultSeconds?: number;
  minSeconds?: number;
  maxSeconds?: number;
  step?: number;
  onFinish?: () => void;
}

export function CountdownTimer({
  label,
  defaultSeconds = 60,
  minSeconds = 10,
  maxSeconds = 600,
  step = 5,
  onFinish,
}: CountdownTimerProps) {
  const [duration, setDuration] = useState<number>(defaultSeconds);
  const [remaining, setRemaining] = useState<number>(defaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const nextRemaining = Math.max(0, duration - elapsed);
      setRemaining(nextRemaining);
      if (nextRemaining === 0) {
        setIsRunning(false);
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        try { onFinish && onFinish(); } catch {}
      }
    };
    intervalRef.current = window.setInterval(tick, 250);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, duration]);

  const minutesSeconds = useMemo(() => {
    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remaining]);

  const onChangeDuration = (value: number[]) => {
    const v = value[0];
    setDuration(v);
    if (!isRunning) setRemaining(v);
  };

  const onStart = () => {
    setRemaining(duration);
    setIsRunning(true);
  };

  const onPause = () => setIsRunning(false);
  const onReset = () => {
    setIsRunning(false);
    setRemaining(duration);
  };

  return (
    <Card className="bg-gradient-card border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="h-5 w-5 text-spotify-green" />
        <h3 className="font-semibold text-foreground">{label}</h3>
      </div>

      <div className="text-center py-2">
        <div className="text-4xl font-bold text-foreground tracking-wider">{minutesSeconds}</div>
      </div>

      <div className="py-2">
        <Slider
          min={minSeconds}
          max={maxSeconds}
          step={step}
          value={[duration]}
          onValueChange={onChangeDuration}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{minSeconds}s</span>
          <span>Duração: {duration}s</span>
          <span>{maxSeconds}s</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {!isRunning ? (
          <Button onClick={onStart} className="flex-1 bg-gradient-primary hover:bg-spotify-green-hover">
            <Play className="h-4 w-4 mr-2" /> Iniciar
          </Button>
        ) : (
          <Button onClick={onPause} variant="secondary" className="flex-1">
            <Pause className="h-4 w-4 mr-2" /> Pausar
          </Button>
        )}
        <Button onClick={onReset} variant="outline" className="flex-1 border-border hover:bg-spotify-surface">
          <RotateCcw className="h-4 w-4 mr-2" /> Resetar
        </Button>
      </div>
    </Card>
  );
}

