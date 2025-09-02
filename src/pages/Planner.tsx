import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { WeeklyAdminModal } from "@/components/workout/weekly-admin-modal";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { isAdmin, users } = useAdmin();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = useMemo(() => users.find(u => u.id === (selectedUserId || user?.id)), [users, selectedUserId, user]);

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
          {isAdmin && selectedUser && (
            <WeeklyAdminModal userId={selectedUser.id} userName={selectedUser.email || "Usuário"} />
          )}
          {!isAdmin && (
            <p className="text-xs text-muted-foreground">Peça a um administrador para montar seu plano.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Planner;


