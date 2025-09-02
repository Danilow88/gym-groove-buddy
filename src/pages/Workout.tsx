import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DaySelector } from "@/components/ui/day-selector";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { AddSetModal } from "@/components/workout/add-set-modal";
import { RestTimer } from "@/components/workout/rest-timer";
import { VideoModal } from "@/components/workout/video-modal";
import { useWorkout } from "@/hooks/use-workout";
import { Dumbbell, Calendar, Play, Target } from "lucide-react";

const Workout = () => {
  const { 
    exercises, 
    currentSets, 
    addSet, 
    removeSet, 
    getMuscleGroups, 
    getFilteredExercises, 
    finishWorkout,
    workoutStartTime,
    selectedMuscleGroup,
    setSelectedMuscleGroup 
  } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoExercise, setVideoExercise] = useState<typeof exercises[0] | null>(null);
  const [selectedWorkoutDays, setSelectedWorkoutDays] = useState<string[]>([]);

  // Verificação de loading/error
  if (!exercises || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="p-8 text-center">
          <Dumbbell className="h-12 w-12 text-spotify-green mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Carregando exercícios...</h2>
          <p className="text-muted-foreground">Aguarde um momento</p>
        </Card>
        <BottomNavigation />
      </div>
    );
  }

  const filteredExercises = getFilteredExercises();
  const hasCurrentWorkout = currentSets && currentSets.length > 0;

  const handleAddSet = (weight: number, reps: number) => {
    if (selectedExercise) {
      addSet(selectedExercise.id, weight, reps);
      setShowAddSetModal(false);
      setShowRestTimer(true);
    }
  };

  const handleFinishWorkout = async () => {
    await finishWorkout();
    setSelectedWorkoutDays([]);
  };

  const handlePlayVideo = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setVideoExercise(exercise);
      setShowVideoModal(true);
    }
  };

  const getWorkoutSummary = () => {
    const totalSets = currentSets ? currentSets.length : 0;
    const uniqueExercises = currentSets ? new Set(currentSets.map(set => set.exerciseId)).size : 0;
    const duration = workoutStartTime ? Math.floor((Date.now() - workoutStartTime) / 1000 / 60) : 0;
    
    return { totalSets, uniqueExercises, duration };
  };

  const { totalSets, uniqueExercises, duration } = getWorkoutSummary();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-spotify-green" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Treino</h1>
            <p className="text-sm text-muted-foreground">
              Monte seu treino personalizado
            </p>
          </div>
        </div>

        {/* Workout Summary */}
        {hasCurrentWorkout && (
          <div className="mt-4 flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {totalSets} séries
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              {uniqueExercises} exercícios
            </Badge>
            {duration > 0 && (
              <Badge variant="outline">
                {duration}min
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {!hasCurrentWorkout && (
          <Card className="p-4 border-spotify-green bg-spotify-green/5">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-spotify-green mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Para quais dias você quer treinar?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione os dias da semana que você pretende fazer este treino
                </p>
                <DaySelector
                  selectedDays={selectedWorkoutDays}
                  onDaysChange={setSelectedWorkoutDays}
                  multiple={true}
                  showBadges={true}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Muscle Group Filter */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Grupo Muscular</h3>
          <div className="flex flex-wrap gap-2">
            {getMuscleGroups().map((group) => (
              <Button
                key={group}
                variant={selectedMuscleGroup === group ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMuscleGroup(group)}
                className={
                  selectedMuscleGroup === group 
                    ? "bg-spotify-green hover:bg-spotify-green/90" 
                    : ""
                }
              >
                {group}
              </Button>
            ))}
          </div>
        </Card>

        {/* Exercise List */}
        <div className="space-y-3">
          {filteredExercises && filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              sets={currentSets ? currentSets.filter(set => set.exerciseId === exercise.id) : []}
              onAddSet={() => {
                setSelectedExercise(exercise);
                setShowAddSetModal(true);
              }}
              onPlayVideo={handlePlayVideo}
              onRemoveSet={(setId) => removeSet(setId)}
            />
          ))}
        </div>

        {/* Finish Workout Button */}
        {hasCurrentWorkout && (
          <div className="pt-4">
            <Card className="p-4 bg-gradient-to-r from-spotify-green/10 to-transparent border-spotify-green/20">
              <div className="text-center space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Finalizar Treino
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {totalSets} séries • {uniqueExercises} exercícios • {duration}min
                  </p>
                </div>
                <Button 
                  onClick={handleFinishWorkout}
                  className="w-full bg-spotify-green hover:bg-spotify-green/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Concluir Treino
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSetModal
        isOpen={showAddSetModal}
        onClose={() => setShowAddSetModal(false)}
        onAddSet={handleAddSet}
        exerciseName={selectedExercise?.name || ''}
      />

      <RestTimer
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        exerciseName={selectedExercise?.name || ''}
      />

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        exerciseName={videoExercise?.name || ''}
        exerciseId={videoExercise?.id || ''}
        muscleGroup={videoExercise?.muscle}
      />

      <BottomNavigation />
    </div>
  );
};

export default Workout;