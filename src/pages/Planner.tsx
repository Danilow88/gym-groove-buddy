import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold text-foreground mb-4">Planejar Treino</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-spotify-card border-border">
          <h2 className="text-lg font-semibold mb-2 text-foreground">Calendário</h2>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border bg-spotify-surface" />
        </Card>
        <Card className="p-4 bg-spotify-card border-border">
          <h2 className="text-lg font-semibold mb-2 text-foreground">Treino do dia</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione uma data e monte o treino para o usuário.
          </p>
          <div className="flex gap-2">
            <Button className="bg-spotify-green hover:bg-spotify-green-hover">Adicionar Exercício</Button>
            <Button variant="secondary" className="bg-spotify-surface">Salvar</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Planner;


