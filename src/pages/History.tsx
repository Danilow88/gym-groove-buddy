import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkout } from "@/hooks/use-workout";
import { useAdmin } from "@/hooks/use-admin";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Dumbbell, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { VideoModal } from "@/components/workout/video-modal";
import { CountdownTimer } from "@/components/timer/countdown-timer";

const History = () => {
  const { workoutHistory, exercises } = useWorkout();
  const { getWorkoutPlansForUser } = useAdmin();
  const { user } = useAuth();
  const [planned, setPlanned] = useState<Array<{ key: string; date: string; exerciseIds: string[]; notes?: string }>>([]);
  const [adminPlans, setAdminPlans] = useState<Array<{ id: string; name: string; exercises: string[]; createdAt: Date }>>([]);
  const [videoState, setVideoState] = useState<{ open: boolean; name: string; url: string }>({ open: false, name: '', url: '' });
  const [inputs, setInputs] = useState<Record<string, { weight?: number; reps?: number; rest?: number }>>({});
  const [restVisible, setRestVisible] = useState<Record<string, boolean>>({});

  const getExerciseName = (exerciseId: string) => {
    return exercises.find(e => e.id === exerciseId)?.name || 'Exercício desconhecido';
  };

  const groupSetsByExercise = (sets: any[]) => {
    const grouped = sets.reduce((acc, set) => {
      if (!acc[set.exerciseId]) {
        acc[set.exerciseId] = [];
      }
      acc[set.exerciseId].push(set);
      return acc;
    }, {});
    return grouped;
  };

  // Load planned workouts from localStorage for current user
  useEffect(() => {
    try {
      const uid = user?.id || 'guest';
      const items: Array<{ key: string; date: string; exerciseIds: string[]; notes?: string }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (key.startsWith(`plan_${uid}_`)) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const payload = JSON.parse(raw);
          items.push({ key, date: payload.date, exerciseIds: payload.exercises || [], notes: payload.notes });
        }
      }
      // sort by date desc
      items.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
      setPlanned(items);
    } catch {}
    // Load admin-created plans for current user
    try {
      const uid = user?.id;
      if (uid) {
        const list = getWorkoutPlansForUser(uid) || [];
        setAdminPlans(list.map(p => ({ id: p.id, name: p.name, exercises: p.exercises, createdAt: p.createdAt })));
      } else {
        setAdminPlans([]);
      }
    } catch {}
  }, [user?.id]);

  const openVideo = (exerciseId: string) => {
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;
    setVideoState({ open: true, name: ex.name, url: ex.videoUrl || '' });
  };

  const saveSetForPlanned = (planKey: string, exerciseId: string) => {
    try {
      const raw = localStorage.getItem(planKey);
      if (!raw) return;
      const payload = JSON.parse(raw);
      const key = `${planKey}_logs`;
      const logsRaw = localStorage.getItem(key);
      const logs = logsRaw ? JSON.parse(logsRaw) : {};
      const inp = inputs[`${planKey}_${exerciseId}`] || {};
      const entry = { weight: inp.weight || 0, reps: inp.reps || 0, rest: inp.rest || 0, ts: Date.now() };
      if (!logs[exerciseId]) logs[exerciseId] = [];
      logs[exerciseId].push(entry);
      localStorage.setItem(key, JSON.stringify(logs));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-spotify-green" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
            <p className="text-sm text-muted-foreground">
              {workoutHistory.length} treinos realizados
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-4">
        {workoutHistory.length === 0 ? (
          <Card className="bg-gradient-card border-border p-8 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum treino ainda
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece seu primeiro treino para ver o histórico aqui
            </p>
          </Card>
        ) : (
          workoutHistory.map((session) => {
            const groupedSets = groupSetsByExercise(session.sets);
            
            return (
              <Card key={session.id} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {format(session.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, "HH:mm")} • {session.sets.length} séries
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-spotify-green font-medium">
                        {Object.keys(groupedSets).length} exercícios
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(groupedSets).map(([exerciseId, sets]: [string, any[]]) => (
                      <div key={exerciseId} className="bg-spotify-surface rounded-lg p-3">
                        <h4 className="font-medium text-foreground mb-2">
                          {getExerciseName(exerciseId)}
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {sets.map((set, index) => (
                            <div key={set.id} className="text-center">
                              <div className="text-xs text-muted-foreground">
                                Série {index + 1}
                              </div>
                              <div className="text-sm font-medium">
                                {set.weight}kg × {set.reps}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })
        )}

        {adminPlans.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground mt-6">Meus treinos montados pela Prof(a)</h2>
            {adminPlans.map(plan => (
              <Card key={plan.id} className="bg-gradient-card border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">{plan.exercises.length} exercícios • {plan.createdAt.toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                <div className="text-sm text-foreground/90">
                  {plan.exercises.map(id => getExerciseName(id)).join(', ')}
                </div>
              </Card>
            ))}
          </>
        )}

        {/* Planned sessions from Planner */}
        {planned.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground mt-6">Meus Treinos Planejados</h2>
            {planned.map(plan => (
              <Card key={plan.key} className="bg-gradient-card border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{format(new Date(plan.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}</div>
                    {plan.notes && <div className="text-xs text-muted-foreground">{plan.notes}</div>}
                  </div>
                  <div className="text-sm text-spotify-green">{plan.exerciseIds.length} exercícios</div>
                </div>
                <div className="space-y-2">
                  {plan.exerciseIds.map(exId => {
                    const ex = exercises.find(e=>e.id===exId);
                    const ik = `${plan.key}_${exId}`;
                    return (
                      <div key={exId} className="bg-spotify-surface border border-border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-foreground">{ex?.name || exId}</div>
                          {ex?.videoUrl && (
                            <Button size="sm" className="bg-spotify-green" onClick={()=> setVideoState({ open: true, name: ex?.name || '', url: ex?.videoUrl || '' })}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Séries" type="number"
                            onChange={(e)=> setInputs(prev=> ({ ...prev, [ik]: { ...prev[ik], reps: Number(e.target.value)||0 } }))} />
                          <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Peso (kg)" type="number"
                            onChange={(e)=> setInputs(prev=> ({ ...prev, [ik]: { ...prev[ik], weight: Number(e.target.value)||0 } }))} />
                          <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Descanso (s)" type="number"
                            onChange={(e)=> setInputs(prev=> ({ ...prev, [ik]: { ...prev[ik], rest: Number(e.target.value)||0 } }))} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-spotify-green" onClick={()=> saveSetForPlanned(plan.key, exId)}>Salvar série</Button>
                          <Button size="sm" variant="secondary" className="bg-spotify-surface" onClick={()=> setRestVisible(prev => ({ ...prev, [ik]: !prev[ik] }))}>Cronômetro</Button>
                        </div>
                        {restVisible[ik] && (
                          <div className="pt-2"><CountdownTimer label="Descanso" defaultSeconds={inputs[ik]?.rest || 60} minSeconds={15} maxSeconds={300} step={5} /></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      <VideoModal isOpen={videoState.open} onClose={()=> setVideoState({ open: false, name: '', url: '' })} exerciseName={videoState.name} videoUrl={videoState.url} />

      <BottomNavigation />
    </div>
  );
};

export default History;