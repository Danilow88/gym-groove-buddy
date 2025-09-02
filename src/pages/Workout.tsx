import { useMemo, useState, useEffect } from "react";
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

  const planStorageKey = useMemo(() => {
    const uid = user?.id || 'guest';
    const day = selectedDate ? selectedDate.toISOString().slice(0,10) : '';
    return day ? `plan_${uid}_${day}` : '';
  }, [user?.id, selectedDate]);

  const [savedPlanExercises, setSavedPlanExercises] = useState<string[]>([]);

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
  }, [planStorageKey]);

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
                  <div className="text-sm font-medium text-foreground mb-1">Treino salvo para o dia</div>
                  <ul className="list-disc pl-5 text-sm text-foreground/90">
                    {savedPlanExercises.map(id => {
                      const ex = exercises.find(e=>e.id===id);
                      return <li key={id}>{ex?.name || id}</li>;
                    })}
                  </ul>
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
            videoUrl={selectedExerciseData.videoUrl || ''}
            fallbackUrl={selectedFallbackUrl}
          />
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Workout;