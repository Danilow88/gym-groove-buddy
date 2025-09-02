import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { WeeklyAdminModal } from "@/components/workout/weekly-admin-modal";
import { useAdmin } from "@/hooks/use-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkout } from "@/hooks/use-workout";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const { exercises } = useWorkout();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(user?.id || null);
  // Como não temos listagem de usuários aqui, usamos apenas o próprio usuário quando não admin
  const selectedUser = useMemo(() => ({ id: selectedUserId || user?.id || '', email: user?.email || 'Usuário' }), [selectedUserId, user]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [planNotes, setPlanNotes] = useState("");

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
          {isAdmin && (
            <div className="mb-3">
              <Select value={selectedUserId || undefined} onValueChange={(v) => setSelectedUserId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={user?.id || ''}>{user?.email || 'Usuário'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {isAdmin && selectedUser && (
            <WeeklyAdminModal userId={selectedUser.id} userName={selectedUser.email || "Usuário"} />
          )}
          {!isAdmin && (
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-foreground mb-2">Selecionar exercícios</div>
                <div className="max-h-64 overflow-auto border border-border rounded p-2 bg-spotify-surface">
                  {exercises.map(ex => (
                    <label key={ex.id} className="flex items-center justify-between text-sm py-1">
                      <span className="mr-2 truncate">{ex.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedExerciseIds.includes(ex.id)}
                        onChange={(e) => setSelectedExerciseIds(prev => e.target.checked ? [...prev, ex.id] : prev.filter(id => id !== ex.id))}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">Observações</div>
                <Textarea value={planNotes} onChange={(e)=>setPlanNotes(e.target.value)} placeholder="Notas para o treino do dia" rows={3} />
              </div>

              <div className="flex gap-2">
                <Button className="bg-spotify-green hover:bg-spotify-green-hover" disabled={!selectedExerciseIds.length}>Salvar treino do dia</Button>
                <Link to="/workout">
                  <Button variant="secondary" className="bg-spotify-surface">Abrir treino</Button>
                </Link>
              </div>

              {/* Lista do treino (prévia) */}
              {selectedExerciseIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-foreground mb-1">Treino do dia</div>
                  <ul className="space-y-1 text-sm">
                    {selectedExerciseIds.map(id => {
                      const ex = exercises.find(e=>e.id===id);
                      return (
                        <li key={id} className="flex items-center justify-between">
                          <span>{ex?.name}</span>
                          <Link to="/workout">
                            <Button size="sm" className="bg-spotify-green">Abrir</Button>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Planner;


