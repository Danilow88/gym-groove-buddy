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
  // PEITO
  {
    id: '1',
    name: 'Supino Reto',
    muscle: 'Peito',
    description: 'Exercício básico para desenvolvimento do peitoral maior',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    lastWeight: 80,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '2',
    name: 'Supino Inclinado',
    muscle: 'Peito',
    description: 'Foca na parte superior do peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=jbBq-HuOLq4',
    lastWeight: 70,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '3',
    name: 'Flexão de Braço',
    muscle: 'Peito',
    description: 'Exercício com peso corporal para peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '4',
    name: 'Crucifixo',
    muscle: 'Peito',
    description: 'Isolamento do peitoral com halteres',
    videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    lastWeight: 20,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '5',
    name: 'Supino Declinado',
    muscle: 'Peito',
    description: 'Trabalha a parte inferior do peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=SrqOu55lrYU',
    lastWeight: 75,
    lastReps: 10,
    lastSets: 3
  },
  
  // COSTAS
  {
    id: '6',
    name: 'Remada Curvada',
    muscle: 'Costas',
    description: 'Excelente para desenvolvimento do latíssimo do dorso',
    videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    lastWeight: 70,
    lastReps: 8,
    lastSets: 3
  },
  {
    id: '7',
    name: 'Pull Down',
    muscle: 'Costas',
    description: 'Trabalha latíssimo e redondo maior',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    lastWeight: 60,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '8',
    name: 'Remada Baixa',
    muscle: 'Costas',
    description: 'Foca na parte média das costas',
    videoUrl: 'https://www.youtube.com/watch?v=xQNrFHEMhI4',
    lastWeight: 65,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '9',
    name: 'Levantamento Terra',
    muscle: 'Costas',
    description: 'Exercício composto para toda a cadeia posterior',
    videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE',
    lastWeight: 100,
    lastReps: 6,
    lastSets: 3
  },
  {
    id: '10',
    name: 'Barra Fixa',
    muscle: 'Costas',
    description: 'Exercício com peso corporal para largura das costas',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    lastWeight: 0,
    lastReps: 8,
    lastSets: 3
  },
  
  // PERNAS
  {
    id: '11',
    name: 'Agachamento',
    muscle: 'Pernas',
    description: 'Movimento fundamental para fortalecimento das pernas',
    videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    lastWeight: 100,
    lastReps: 12,
    lastSets: 4
  },
  {
    id: '12',
    name: 'Leg Press',
    muscle: 'Pernas',
    description: 'Exercício para quadríceps e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    lastWeight: 200,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '13',
    name: 'Extensão de Pernas',
    muscle: 'Pernas',
    description: 'Isolamento do quadríceps',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    lastWeight: 50,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '14',
    name: 'Mesa Flexora',
    muscle: 'Pernas',
    description: 'Isolamento dos posteriores de coxa',
    videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    lastWeight: 40,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '15',
    name: 'Elevação Panturrilha',
    muscle: 'Pernas',
    description: 'Exercício para panturrilhas',
    videoUrl: 'https://www.youtube.com/watch?v=JsAqKhGnxrE',
    lastWeight: 80,
    lastReps: 20,
    lastSets: 4
  },
  {
    id: '16',
    name: 'Afundo',
    muscle: 'Pernas',
    description: 'Exercício unilateral para pernas e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    lastWeight: 40,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '17',
    name: 'Stiff',
    muscle: 'Pernas',
    description: 'Trabalha posteriores de coxa e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=1uDiW5--rTM',
    lastWeight: 60,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '18',
    name: 'Agachamento Búlgaro',
    muscle: 'Pernas',
    description: 'Exercício unilateral avançado para pernas',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    lastWeight: 30,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '19',
    name: 'Cadeira Adutora',
    muscle: 'Pernas',
    description: 'Isolamento dos músculos adutores',
    videoUrl: 'https://www.youtube.com/watch?v=cAyRw7z4BQM',
    lastWeight: 50,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '20',
    name: 'Cadeira Abdutora',
    muscle: 'Pernas',
    description: 'Trabalha os músculos abdutores',
    videoUrl: 'https://www.youtube.com/watch?v=YV0gLbcAJ8w',
    lastWeight: 45,
    lastReps: 15,
    lastSets: 3
  },
  
  // OMBROS
  {
    id: '21',
    name: 'Desenvolvimento',
    muscle: 'Ombros',
    description: 'Trabalha deltoides anterior, medial e posterior',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    lastWeight: 40,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '22',
    name: 'Elevação Lateral',
    muscle: 'Ombros',
    description: 'Isolamento do deltoide medial',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    lastWeight: 15,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '23',
    name: 'Elevação Frontal',
    muscle: 'Ombros',
    description: 'Trabalha a parte anterior do deltoide',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    lastWeight: 12,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '24',
    name: 'Elevação Posterior',
    muscle: 'Ombros',
    description: 'Foca no deltoide posterior',
    videoUrl: 'https://www.youtube.com/watch?v=EA7u4Q_8HQ0',
    lastWeight: 10,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '25',
    name: 'Remada Alta',
    muscle: 'Ombros',
    description: 'Exercício composto para ombros e trapézio',
    videoUrl: 'https://www.youtube.com/watch?v=amCU-ziHITM',
    lastWeight: 35,
    lastReps: 12,
    lastSets: 3
  },
  
  // BÍCEPS
  {
    id: '26',
    name: 'Rosca Direta',
    muscle: 'Bíceps',
    description: 'Isolamento do bíceps braquial',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    lastWeight: 30,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '27',
    name: 'Rosca Martelo',
    muscle: 'Bíceps',
    description: 'Trabalha bíceps e antebraço',
    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '28',
    name: 'Rosca Scott',
    muscle: 'Bíceps',
    description: 'Isolamento máximo do bíceps',
    videoUrl: 'https://www.youtube.com/watch?v=uO_CNh3rkLo',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '29',
    name: 'Rosca Concentrada',
    muscle: 'Bíceps',
    description: 'Exercício de isolamento unilateral',
    videoUrl: 'https://www.youtube.com/watch?v=0AUGkch3tzc',
    lastWeight: 18,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '30',
    name: 'Rosca no Cabo',
    muscle: 'Bíceps',
    description: 'Tensão constante no bíceps',
    videoUrl: 'https://www.youtube.com/watch?v=NFzTWp2qpiE',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  
  // TRÍCEPS
  {
    id: '31',
    name: 'Tríceps Testa',
    muscle: 'Tríceps',
    description: 'Exercício de isolamento para tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '32',
    name: 'Mergulho',
    muscle: 'Tríceps',
    description: 'Exercício com peso corporal para tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '33',
    name: 'Tríceps Pulley',
    muscle: 'Tríceps',
    description: 'Isolamento do tríceps no cabo',
    videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    lastWeight: 30,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '34',
    name: 'Tríceps Coice',
    muscle: 'Tríceps',
    description: 'Exercício unilateral com halteres',
    videoUrl: 'https://www.youtube.com/watch?v=_gsUck-7M74',
    lastWeight: 15,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '35',
    name: 'Tríceps Supino Fechado',
    muscle: 'Tríceps',
    description: 'Exercício composto para tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=nEF0bv2FW94',
    lastWeight: 50,
    lastReps: 10,
    lastSets: 3
  },
  
  // ABDÔMEN
  {
    id: '36',
    name: 'Abdominal Reto',
    muscle: 'Abdômen',
    description: 'Exercício básico para reto abdominal',
    videoUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '37',
    name: 'Prancha',
    muscle: 'Abdômen',
    description: 'Exercício isométrico para core',
    videoUrl: 'https://www.youtube.com/watch?v=TvxNkmjdhMM',
    lastWeight: 0,
    lastReps: 60,
    lastSets: 3
  },
  {
    id: '38',
    name: 'Abdominal Oblíquo',
    muscle: 'Abdômen',
    description: 'Trabalha os músculos oblíquos',
    videoUrl: 'https://www.youtube.com/watch?v=8ioA-ycHOCo',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '39',
    name: 'Abdominal Bicicleta',
    muscle: 'Abdômen',
    description: 'Exercício dinâmico para oblíquos',
    videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '40',
    name: 'Elevação de Pernas',
    muscle: 'Abdômen',
    description: 'Trabalha a parte inferior do abdômen',
    videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  }
];

export function useWorkout() {
  const [exercises] = useState<Exercise[]>(mockExercises);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('Todos');

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

  const getFilteredExercises = useCallback(() => {
    if (selectedMuscleGroup === 'Todos') {
      return exercises;
    }
    return exercises.filter(exercise => exercise.muscle === selectedMuscleGroup);
  }, [exercises, selectedMuscleGroup]);

  const getMuscleGroups = useCallback(() => {
    const groups = ['Todos', ...new Set(exercises.map(exercise => exercise.muscle))];
    return groups;
  }, [exercises]);

  return {
    exercises,
    currentSets,
    workoutHistory,
    selectedMuscleGroup,
    addSet,
    finishWorkout,
    getCurrentSetsForExercise,
    getFilteredExercises,
    getMuscleGroups,
    setSelectedMuscleGroup
  };
}