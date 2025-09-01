import { useState, useCallback } from 'react';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  description: string;
  videoUrl?: string;
  lastWeight?: number;
  lastReps?: number;
  lastSets?: number;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  timestamp: Date;
}

export interface WorkoutSession {
  id: string;
  date: Date;
  sets: WorkoutSet[];
  duration?: number;
}

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Supino Reto',
    muscle: 'Peito',
    description: 'Exercício básico para desenvolvimento do peitoral maior',
    videoUrl: '/videos/supino.mp4',
    lastWeight: 80,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '2',
    name: 'Agachamento',
    muscle: 'Pernas',
    description: 'Movimento fundamental para fortalecimento das pernas',
    videoUrl: '/videos/agachamento.mp4',
    lastWeight: 100,
    lastReps: 12,
    lastSets: 4
  },
  {
    id: '3',
    name: 'Remada Curvada',
    muscle: 'Costas',
    description: 'Excelente para desenvolvimento do latíssimo do dorso',
    videoUrl: '/videos/remada.mp4',
    lastWeight: 70,
    lastReps: 8,
    lastSets: 3
  },
  {
    id: '4',
    name: 'Desenvolvimento',
    muscle: 'Ombros',
    description: 'Trabalha deltoides anterior, medial e posterior',
    videoUrl: '/videos/desenvolvimento.mp4',
    lastWeight: 40,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '5',
    name: 'Rosca Direta',
    muscle: 'Bíceps',
    description: 'Isolamento do bíceps braquial',
    videoUrl: '/videos/rosca.mp4',
    lastWeight: 30,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '6',
    name: 'Tríceps Testa',
    muscle: 'Tríceps',
    description: 'Exercício de isolamento para tríceps',
    videoUrl: '/videos/triceps.mp4',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  }
];

export function useWorkout() {
  const [exercises] = useState<Exercise[]>(mockExercises);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);

  const addSet = useCallback((exerciseId: string, weight: number, reps: number) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId,
      weight,
      reps,
      timestamp: new Date()
    };
    setCurrentSets(prev => [...prev, newSet]);
  }, []);

  const finishWorkout = useCallback(() => {
    if (currentSets.length > 0) {
      const session: WorkoutSession = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        sets: currentSets
      };
      setWorkoutHistory(prev => [session, ...prev]);
      setCurrentSets([]);
    }
  }, [currentSets]);

  const getCurrentSetsForExercise = useCallback((exerciseId: string) => {
    return currentSets.filter(set => set.exerciseId === exerciseId);
  }, [currentSets]);

  return {
    exercises,
    currentSets,
    workoutHistory,
    addSet,
    finishWorkout,
    getCurrentSetsForExercise
  };
}