import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/timer/countdown-timer";
import { PlayCircle, Flame, StretchHorizontal } from "lucide-react";

const gluteVideos = [
  { title: "Hip Thrust", url: "https://www.youtube.com/watch?v=LM8XHLYJoYs" },
  { title: "Agachamento Búlgaro", url: "https://www.youtube.com/watch?v=2C-uNgKwPLE" },
  { title: "Abdução de Quadril", url: "https://www.youtube.com/watch?v=5e6mT-7jUX0" },
];

const cardioVideos = [
  { title: "HIIT 20 Minutos", url: "https://www.youtube.com/watch?v=ml6cT4AZdqI" },
  { title: "Cardio Baixo Impacto", url: "https://www.youtube.com/watch?v=ml4M8x2dCq4" },
  { title: "Jumping Jacks e Variados", url: "https://www.youtube.com/watch?v=c4DAnQ6DtF8" },
];

export default function Timers() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">Cronômetros</h1>
        <p className="text-sm text-muted-foreground">Descanso, Glúteos e Cardio</p>
      </div>

      <div className="p-4 space-y-6">
        <CountdownTimer label="Descanso Rápido" defaultSeconds={60} minSeconds={15} maxSeconds={240} step={5} />

        <Card className="bg-gradient-card border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <StretchHorizontal className="h-5 w-5 text-spotify-green" />
            <h2 className="text-lg font-semibold text-foreground">Glúteos</h2>
          </div>
          <div className="space-y-4">
            <CountdownTimer label="Série de Glúteos" defaultSeconds={45} minSeconds={20} maxSeconds={120} step={5} />
            <div className="grid grid-cols-1 gap-2">
              {gluteVideos.map((v) => (
                <a
                  key={v.url}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between bg-spotify-surface rounded-md p-3 hover:bg-spotify-surface/80 transition"
                >
                  <span className="text-sm text-foreground">{v.title}</span>
                  <Button size="sm" variant="secondary">
                    <PlayCircle className="h-4 w-4 mr-1" /> Assistir
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-5 w-5 text-spotify-green" />
            <h2 className="text-lg font-semibold text-foreground">Cardio</h2>
          </div>
          <div className="space-y-4">
            <CountdownTimer label="Intervalo de Cardio" defaultSeconds={30} minSeconds={15} maxSeconds={180} step={5} />
            <div className="grid grid-cols-1 gap-2">
              {cardioVideos.map((v) => (
                <a
                  key={v.url}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between bg-spotify-surface rounded-md p-3 hover:bg-spotify-surface/80 transition"
                >
                  <span className="text-sm text-foreground">{v.title}</span>
                  <Button size="sm" variant="secondary">
                    <PlayCircle className="h-4 w-4 mr-1" /> Assistir
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}

