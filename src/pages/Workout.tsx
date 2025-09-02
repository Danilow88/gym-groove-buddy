import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar as DayCalendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { AddSetModal } from "@/components/workout/add-set-modal";
import { VideoModal } from "@/components/workout/video-modal";
import { RestTimer } from "@/components/workout/rest-timer";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useWorkout } from "@/hooks/use-workout";
import { useExerciseVideos } from "@/hooks/use-exercise-videos";
import { Play, Square, Filter, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CountdownTimer } from "@/components/timer/countdown-timer";
import { useAuth } from "@/hooks/use-auth";

const Workout = () => {
  const { 
    exercises, 
    addSet, 
    finishWorkout, 
    getCurrentSetsForExercise, 
    getFilteredExercises, 
    getMuscleGroups, 
    selectedMuscleGroup, 
    setSelectedMuscleGroup 
  } = useWorkout();
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const { getUrlForExercise } = useExerciseVideos();

  const planStorageKey = useMemo(() => {
    const uid = user?.id || 'guest';
    const day = selectedDate ? selectedDate.toISOString().slice(0,10) : '';
    return day ? `plan_${uid}_${day}` : '';
  }, [user?.id, selectedDate]);

  const [savedPlanExercises, setSavedPlanExercises] = useState<string[]>([]);
  const [planInputs, setPlanInputs] = useState<Record<string, { sets?: number; weight?: number; rest?: number }>>({});
  const [planTimerVisible, setPlanTimerVisible] = useState<Record<string, boolean>>({});
  const quickTimerIntervalsRef = useRef<Record<string, number>>({});
  const [quickTimerRemaining, setQuickTimerRemaining] = useState<Record<string, number>>({});
  const [quickTimerRunning, setQuickTimerRunning] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!planStorageKey) return;
    try {
      const raw = localStorage.getItem(planStorageKey);
      if (raw) {
        const payload = JSON.parse(raw);
        setSavedPlanExercises(Array.isArray(payload.exercises) ? payload.exercises : []);
      } else {
        setSavedPlanExercises([]);
      }
    } catch {
      setSavedPlanExercises([]);
    }
    // load per-exercise settings
    try {
      const settingsRaw = localStorage.getItem(`${planStorageKey}_settings`);
      setPlanInputs(settingsRaw ? JSON.parse(settingsRaw) : {});
    } catch {
      setPlanInputs({});
    }
  }, [planStorageKey]);

  // Prefill per-exercise settings from latest admin plan for this user if available
  useEffect(() => {
    try {
      const uid = user?.id || 'guest';
      const raw = localStorage.getItem('admin_workout_plans');
      if (!raw) return;
      const plans = JSON.parse(raw) as Array<{ userId: string; createdAt: string | Date; exerciseSettings?: Record<string, { sets?: number; rest?: number; weight?: number }> }>;
      const userPlans = plans.filter(p => p.userId === uid);
      if (userPlans.length === 0) return;
      userPlans.sort((a,b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
      const latest = userPlans[0];
      if (!latest.exerciseSettings) return;
      // Merge defaults for current day selection
      setPlanInputs(prev => {
        const merged = { ...prev } as Record<string, { sets?: number; rest?: number; weight?: number }>;
        savedPlanExercises.forEach(id => {
          const adminSet = latest.exerciseSettings![id];
          if (!adminSet) return;
          const current = merged[id] || {};
          merged[id] = {
            sets: current.sets ?? (typeof adminSet.sets === 'number' ? adminSet.sets : undefined),
            rest: current.rest ?? (typeof adminSet.rest === 'number' ? adminSet.rest : undefined),
            weight: current.weight ?? (typeof adminSet.weight === 'number' ? adminSet.weight : undefined),
          };
        });
        return merged;
      });
    } catch {}
  }, [user?.id, savedPlanExercises]);

  useEffect(() => {
    // cleanup intervals on unmount or when changing plan key
    return () => {
      Object.values(quickTimerIntervalsRef.current).forEach((id) => {
        if (id) window.clearInterval(id);
      });
      quickTimerIntervalsRef.current = {};
    };
  }, [planStorageKey]);

  const formatMMSS = (total: number) => {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startQuickTimer = (exerciseId: string) => {
    const rest = (planInputs[exerciseId]?.rest && planInputs[exerciseId]?.rest! > 0) ? Number(planInputs[exerciseId]?.rest) : 60;
    // initialize
    setQuickTimerRunning(prev => ({ ...prev, [exerciseId]: true }));
    setQuickTimerRemaining(prev => ({ ...prev, [exerciseId]: rest }));
    // clear existing
    const prevId = quickTimerIntervalsRef.current[exerciseId];
    if (prevId) window.clearInterval(prevId);
    const id = window.setInterval(() => {
      setQuickTimerRemaining(prev => {
        const current = prev[exerciseId] ?? rest;
        const next = current - 1;
        if (next <= 0) {
          const resetTo = (planInputs[exerciseId]?.rest && planInputs[exerciseId]?.rest! > 0) ? Number(planInputs[exerciseId]?.rest) : 60;
          return { ...prev, [exerciseId]: resetTo };
        }
        return { ...prev, [exerciseId]: next };
      });
    }, 1000);
    quickTimerIntervalsRef.current[exerciseId] = id;
  };

  const stopQuickTimer = (exerciseId: string) => {
    const prevId = quickTimerIntervalsRef.current[exerciseId];
    if (prevId) window.clearInterval(prevId);
    delete quickTimerIntervalsRef.current[exerciseId];
    setQuickTimerRunning(prev => ({ ...prev, [exerciseId]: false }));
  };

  const handleSavePlannedWorkout = () => {
    if (!planStorageKey || selectedExerciseIds.length === 0) return;
    const payload = {
      userId: user?.id || 'guest',
      date: selectedDate?.toISOString() || new Date().toISOString(),
      notes: '',
      exercises: selectedExerciseIds,
    };
    try {
      localStorage.setItem(planStorageKey, JSON.stringify(payload));
      setSavedPlanExercises(selectedExerciseIds);
    } catch {}
  };

  const savePlanSettings = (exerciseId: string) => {
    if (!planStorageKey) return;
    try {
      const key = `${planStorageKey}_settings`;
      const existing = localStorage.getItem(key);
      const settings = existing ? JSON.parse(existing) : {};
      const current = planInputs[exerciseId] || {};
      settings[exerciseId] = {
        sets: Number(current.sets) || 0,
        weight: Number(current.weight) || 0,
        rest: Number(current.rest) || 0,
      };
      localStorage.setItem(key, JSON.stringify(settings));
    } catch {}
  };

  const canStartWorkout = useMemo(() => selectedExerciseIds.length > 0 && selectedExerciseIds.length <= 15, [selectedExerciseIds]);
  const selectionCountLabel = useMemo(() => `${selectedExerciseIds.length} selecionado(s)`, [selectedExerciseIds]);

  const handleAddSet = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setShowAddSetModal(true);
  };

  const handlePlayVideo = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setShowVideoModal(true);
  };

  const handleSetSubmit = (data: { weight: number; reps: number }) => {
    if (selectedExercise) {
      addSet(selectedExercise, data.weight, data.reps);
      setIsWorkoutActive(true);
      toast({
        title: "Série adicionada!",
        description: `${data.weight}kg x ${data.reps} reps`,
      });
    }
  };

  const toggleSelectExercise = (exerciseId: string) => {
    setSelectedExerciseIds(prev => {
      const exists = prev.includes(exerciseId);
      if (exists) return prev.filter(id => id !== exerciseId);
      if (prev.length >= 15) {
        toast({ title: "Limite atingido", description: "Você pode escolher até 15 exercícios." });
        return prev;
      }
      return [...prev, exerciseId];
    });
  };

  const handleStartWorkout = () => {
    if (!canStartWorkout) return;
    setIsSelecting(false);
    setIsWorkoutActive(true);
    toast({ title: "Treino iniciado", description: selectionCountLabel });
  };

  const handleFinishWorkout = () => {
    finishWorkout();
    setIsWorkoutActive(false);
    setSelectedExerciseIds([]);
    toast({
      title: "Treino finalizado!",
      description: "Parabéns! Seu treino foi salvo no histórico.",
    });
  };

  const selectedExerciseData = exercises.find(e => e.id === selectedExercise);
  const genericFallbackByMuscle: Record<string, string> = {
    Peito: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
    Costas: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    Pernas: 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    Ombros: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    Bíceps: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    Tríceps: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    Abdômen: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    Glúteo: 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    Cardio: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
  };
  const selectedFallbackUrl = selectedExerciseData ? genericFallbackByMuscle[selectedExerciseData.muscle] : undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Treino</h1>
            <p className="text-sm text-muted-foreground">
              {isWorkoutActive ? "Treino em andamento" : "Selecione os exercícios"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isWorkoutActive && (
              <>
                {!isSelecting ? (
                  <Button onClick={() => setIsSelecting(true)} size="sm" className="bg-spotify-green hover:bg-spotify-green-hover">
                    Selecionar exercícios
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectionCountLabel}</span>
                    <Button onClick={() => setIsSelecting(false)} variant="secondary" size="sm" className="bg-spotify-surface">
                      Cancelar
                    </Button>
                    <Button onClick={handleStartWorkout} disabled={!canStartWorkout} size="sm" className="bg-spotify-green hover:bg-spotify-green-hover disabled:opacity-50">
                      <Play className="h-4 w-4 mr-2" /> Iniciar treino
                    </Button>
                  </div>
                )}
              </>
            )}
          {isWorkoutActive && (
            <Button
              onClick={handleFinishWorkout}
              variant="destructive"
              size="sm"
              className="bg-destructive hover:bg-destructive/90"
            >
              <Square className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          )}
          </div>
        </div>
        
        {/* Filter */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-spotify-green" />
            <span className="text-sm font-medium text-foreground">Filtrar por grupo muscular:</span>
          </div>
          <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
            <SelectTrigger className="w-full bg-spotify-surface border-border">
              <SelectValue placeholder="Selecione um grupo muscular" />
            </SelectTrigger>
            <SelectContent className="bg-spotify-card border-border">
              {getMuscleGroups().map((group) => (
                <SelectItem key={group} value={group} className="text-foreground hover:bg-spotify-surface">
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-4">
        {/* Planejamento Inline (sem Planner dedicado) */}
        <Card className="bg-gradient-card border-border p-4">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-foreground">Treino por data</h2>
            <p className="text-sm text-muted-foreground">Selecione um dia e salve a seleção de exercícios direto aqui.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <DayCalendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border border-border bg-spotify-surface" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={handleSavePlannedWorkout} disabled={selectedExerciseIds.length === 0} size="sm" className="bg-spotify-green hover:bg-spotify-green-hover disabled:opacity-50">Salvar seleção do dia</Button>
                <Button onClick={() => setSelectedExerciseIds(savedPlanExercises)} size="sm" variant="secondary" className="bg-spotify-surface">Carregar seleção salva</Button>
              </div>
              {savedPlanExercises.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-foreground mb-2">Treino salvo para o dia</div>
                  <div className="space-y-2">
                    {savedPlanExercises.map(id => {
                      const ex = exercises.find(e=>e.id===id);
                      if (!ex) return null;
                      const input = planInputs[id] || {};
                      return (
                        <div key={id} className="bg-spotify-surface border border-border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-foreground">{ex.name}</div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-spotify-green hover:bg-spotify-green-hover" onClick={()=>{ setSelectedExercise(ex.id); setShowVideoModal(true); }}>Mostrar execução</Button>
                              <Button size="sm" variant="secondary" className="bg-spotify-surface" onClick={()=> setPlanTimerVisible(prev=> ({ ...prev, [id]: !prev[id] }))}>Cronômetro pausa descanso</Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Séries" type="number" value={input.sets ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [id]: { ...prev[id], sets: Number(e.target.value)||0 } }))} />
                            <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Peso (kg)" type="number" value={input.weight ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [id]: { ...prev[id], weight: Number(e.target.value)||0 } }))} />
                            <input className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm" placeholder="Descanso (s)" type="number" value={input.rest ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [id]: { ...prev[id], rest: Number(e.target.value)||0 } }))} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-spotify-green" onClick={()=> savePlanSettings(id)}>Salvar</Button>
                            <Button size="sm" variant="outline" className="border-border" onClick={()=> startQuickTimer(id)}>
                              <Timer className="h-4 w-4 mr-1 text-spotify-green" />
                              Reloginho {typeof quickTimerRemaining[id] === 'number' ? `(${formatMMSS(quickTimerRemaining[id])})` : ''}
                            </Button>
                            {quickTimerRunning[id] && (
                              <Button size="sm" variant="secondary" className="bg-spotify-surface" onClick={()=> stopQuickTimer(id)}>Parar</Button>
                            )}
                          </div>
                          {planTimerVisible[id] && (
                            <div className="pt-2">
                              <CountdownTimer label="Descanso" defaultSeconds={planInputs[id]?.rest || 60} minSeconds={15} maxSeconds={300} step={5} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        {/* Rest Timer */}
        <div className="bg-spotify-surface rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-spotify-green" />
              <span className="text-sm font-medium text-foreground">Cronômetro de Descanso</span>
            </div>
            <button
              className="text-xs text-spotify-green hover:text-spotify-green-hover"
              onClick={() => setShowRestTimer((v) => !v)}
            >
              {showRestTimer ? "Esconder" : "Mostrar"}
            </button>
          </div>
          {showRestTimer && (
            <CountdownTimer label="Descanso" defaultSeconds={60} minSeconds={15} maxSeconds={240} step={5} />
          )}
        </div>

        {getFilteredExercises().map((exercise) => {
          const currentSets = getCurrentSetsForExercise(exercise.id);
          return (
            <div key={exercise.id}>
              <ExerciseCard
                exercise={exercise}
                onAddSet={handleAddSet}
                onPlayVideo={handlePlayVideo}
                selectable={isSelecting}
                selected={selectedExerciseIds.includes(exercise.id)}
                onToggleSelect={toggleSelectExercise}
              />
              
              {/* Current Sets */}
              {currentSets.length > 0 && (
                <div className="mt-3 bg-spotify-surface rounded-lg p-3">
                  <h4 className="text-sm font-medium text-spotify-green mb-2">
                    Séries de hoje ({currentSets.length})
                  </h4>
                  <div className="space-y-1">
                    {currentSets.map((set, index) => (
                      <div key={set.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Série {index + 1}
                        </span>
                        <span className="text-foreground">
                          {set.weight}kg × {set.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rest Timer */}
      {isWorkoutActive && (
        <div className="px-4">
          <RestTimer defaultSeconds={60} />
        </div>
      )}

      {/* Modals */}
      {selectedExerciseData && (
        <>
          <AddSetModal
            isOpen={showAddSetModal}
            onClose={() => setShowAddSetModal(false)}
            exerciseName={selectedExerciseData.name}
            onAddSet={handleSetSubmit}
          />
          
          <VideoModal
            isOpen={showVideoModal}
            onClose={() => setShowVideoModal(false)}
            exerciseName={selectedExerciseData.name}
            videoUrl={getUrlForExercise(selectedExerciseData.id, selectedExerciseData.videoUrl || '')}
            fallbackUrl={selectedFallbackUrl}
          />
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Workout;