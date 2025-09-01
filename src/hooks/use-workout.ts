import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

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
    videoUrl: 'https://www.youtube.com/watch?v=esQi683XR44',
    lastWeight: 80,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '2',
    name: 'Supino Inclinado',
    muscle: 'Peito',
    description: 'Foca na parte superior do peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=DbFgADa2PL8',
    lastWeight: 70,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '3',
    name: 'Flexão de Braço',
    muscle: 'Peito',
    description: 'Exercício com peso corporal para peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=mm_KOnjn6nU',
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
    id: '31',
    name: 'Supino Declinado',
    muscle: 'Peito',
    description: 'Foca na parte inferior do peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE',
    lastWeight: 60,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '32',
    name: 'Crossover',
    muscle: 'Peito',
    description: 'Isolamento do peitoral no cabo crossover',
    videoUrl: 'https://www.youtube.com/watch?v=QnBmVmrRk3k',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '33',
    name: 'Flexão Diamante',
    muscle: 'Peito',
    description: 'Variação de flexão focada no tríceps e peitoral interno',
    videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '34',
    name: 'Pec Deck',
    muscle: 'Peito',
    description: 'Isolamento guiado do peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=Z8SACXPOU5c',
    lastWeight: 35,
    lastReps: 12,
    lastSets: 3
  },
  
  // COSTAS
  {
    id: '5',
    name: 'Remada Curvada',
    muscle: 'Costas',
    description: 'Excelente para desenvolvimento do latíssimo do dorso',
    videoUrl: 'https://www.youtube.com/watch?v=gQBSMH3GZJA',
    lastWeight: 70,
    lastReps: 8,
    lastSets: 3
  },
  {
    id: '6',
    name: 'Pull Down',
    muscle: 'Costas',
    description: 'Trabalha latíssimo e redondo maior',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    lastWeight: 60,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '7',
    name: 'Remada Baixa',
    muscle: 'Costas',
    description: 'Foca na parte média das costas',
    videoUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    lastWeight: 65,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '8',
    name: 'Levantamento Terra',
    muscle: 'Costas',
    description: 'Exercício composto para toda a cadeia posterior',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    lastWeight: 100,
    lastReps: 6,
    lastSets: 3
  },
  {
    id: '35',
    name: 'Barra Fixa',
    muscle: 'Costas',
    description: 'Exercício com peso corporal para latíssimo',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    lastWeight: 0,
    lastReps: 8,
    lastSets: 3
  },
  {
    id: '36',
    name: 'Remada Unilateral',
    muscle: 'Costas',
    description: 'Trabalha um lado por vez, corrige desequilíbrios',
    videoUrl: 'https://www.youtube.com/watch?v=4T9UQ4FBVXI',
    lastWeight: 30,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '37',
    name: 'Pull Down Pegada Neutra',
    muscle: 'Costas',
    description: 'Variação com pegada neutra para múltiplos ângulos',
    videoUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    lastWeight: 55,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '38',
    name: 'Pulley Alto',
    muscle: 'Costas',
    description: 'Isolamento dos músculos das costas no cabo alto',
    videoUrl: 'https://www.youtube.com/watch?v=6yMdhi2DVao',
    lastWeight: 40,
    lastReps: 12,
    lastSets: 3
  },
  
  // PERNAS
  {
    id: '9',
    name: 'Agachamento',
    muscle: 'Pernas',
    description: 'Movimento fundamental para fortalecimento das pernas',
    videoUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    lastWeight: 100,
    lastReps: 12,
    lastSets: 4
  },
  {
    id: '10',
    name: 'Leg Press',
    muscle: 'Pernas',
    description: 'Exercício para quadríceps e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    lastWeight: 200,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '11',
    name: 'Extensão de Pernas',
    muscle: 'Pernas',
    description: 'Isolamento do quadríceps',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    lastWeight: 50,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '12',
    name: 'Mesa Flexora',
    muscle: 'Pernas',
    description: 'Isolamento dos posteriores de coxa',
    videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    lastWeight: 40,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '13',
    name: 'Elevação Panturrilha',
    muscle: 'Pernas',
    description: 'Exercício para panturrilhas',
    videoUrl: 'https://www.youtube.com/watch?v=JsAqKhGnxrE',
    lastWeight: 80,
    lastReps: 20,
    lastSets: 4
  },
  {
    id: '39',
    name: 'Agachamento Frontal',
    muscle: 'Pernas',
    description: 'Variação que enfatiza mais o core e quadríceps',
    videoUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0',
    lastWeight: 60,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '40',
    name: 'Stiff',
    muscle: 'Pernas',
    description: 'Foca nos posteriores de coxa e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=1s8R4CdCGSs',
    lastWeight: 80,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '41',
    name: 'Afundo',
    muscle: 'Pernas',
    description: 'Exercício unilateral completo para pernas',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    lastWeight: 40,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '42',
    name: 'Hack Squat',
    muscle: 'Pernas',
    description: 'Agachamento guiado na máquina hack',
    videoUrl: 'https://www.youtube.com/watch?v=EdtaJRBquls',
    lastWeight: 120,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '43',
    name: 'Passada',
    muscle: 'Pernas',
    description: 'Exercício dinâmico para quadríceps e glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  
  // OMBROS
  {
    id: '14',
    name: 'Desenvolvimento',
    muscle: 'Ombros',
    description: 'Trabalha deltoides anterior, medial e posterior',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    lastWeight: 40,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '15',
    name: 'Elevação Lateral',
    muscle: 'Ombros',
    description: 'Isolamento do deltoide medial',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    lastWeight: 15,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '16',
    name: 'Elevação Frontal',
    muscle: 'Ombros',
    description: 'Trabalha a parte anterior do deltoide',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    lastWeight: 12,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '17',
    name: 'Elevação Posterior',
    muscle: 'Ombros',
    description: 'Foca no deltoide posterior',
    videoUrl: 'https://www.youtube.com/watch?v=EA7u4Q_8HQ0',
    lastWeight: 10,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '44',
    name: 'Desenvolvimento Arnold',
    muscle: 'Ombros',
    description: 'Variação que trabalha todos os deltoides',
    videoUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '45',
    name: 'Remada Alta',
    muscle: 'Ombros',
    description: 'Trabalha deltoides e trapézio',
    videoUrl: 'https://www.youtube.com/watch?v=XP8H8eGBk4o',
    lastWeight: 40,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '46',
    name: 'Face Pull',
    muscle: 'Ombros',
    description: 'Excelente para deltoide posterior e postura',
    videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    lastWeight: 20,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '47',
    name: 'Encolhimento',
    muscle: 'Ombros',
    description: 'Isolamento do trapézio',
    videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    lastWeight: 60,
    lastReps: 12,
    lastSets: 3
  },
  
  // BÍCEPS
  {
    id: '18',
    name: 'Rosca Direta',
    muscle: 'Bíceps',
    description: 'Isolamento do bíceps braquial',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    lastWeight: 30,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '19',
    name: 'Rosca Martelo',
    muscle: 'Bíceps',
    description: 'Trabalha bíceps e antebraço',
    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '20',
    name: 'Rosca Scott',
    muscle: 'Bíceps',
    description: 'Isolamento máximo do bíceps',
    videoUrl: 'https://www.youtube.com/watch?v=uO_CNh3rkLo',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '48',
    name: 'Rosca Concentrada',
    muscle: 'Bíceps',
    description: 'Isolamento total do bíceps sentado',
    videoUrl: 'https://www.youtube.com/watch?v=Jvj2wV0DKzs',
    lastWeight: 15,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '49',
    name: 'Rosca 21',
    muscle: 'Bíceps',
    description: 'Técnica avançada com três fases de movimento',
    videoUrl: 'https://www.youtube.com/watch?v=SSbf4mBKq-o',
    lastWeight: 20,
    lastReps: 21,
    lastSets: 3
  },
  {
    id: '50',
    name: 'Rosca no Cabo',
    muscle: 'Bíceps',
    description: 'Tensão constante com cabo',
    videoUrl: 'https://www.youtube.com/watch?v=NFzTWp2qpiw',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '51',
    name: 'Rosca Inversa',
    muscle: 'Bíceps',
    description: 'Foca no braquial e antebraço',
    videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  
  // TRÍCEPS
  {
    id: '21',
    name: 'Tríceps Testa',
    muscle: 'Tríceps',
    description: 'Exercício de isolamento para tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=nALyRHQP4qE',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '22',
    name: 'Mergulho',
    muscle: 'Tríceps',
    description: 'Exercício com peso corporal para tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '23',
    name: 'Tríceps Pulley',
    muscle: 'Tríceps',
    description: 'Isolamento do tríceps no cabo',
    videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    lastWeight: 30,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '52',
    name: 'Tríceps Francês',
    muscle: 'Tríceps',
    description: 'Alongamento máximo do tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=PopGJp8jRnU',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '53',
    name: 'Flexão Fechada',
    muscle: 'Tríceps',
    description: 'Peso corporal focado no tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    lastWeight: 0,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '54',
    name: 'Tríceps Coice',
    muscle: 'Tríceps',
    description: 'Isolamento unilateral do tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
    lastWeight: 10,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '55',
    name: 'Tríceps Corda',
    muscle: 'Tríceps',
    description: 'Variação com corda no cabo',
    videoUrl: 'https://www.youtube.com/watch?v=kiuVA0gs3EI',
    lastWeight: 25,
    lastReps: 12,
    lastSets: 3
  },
  
  // ABDÔMEN
  {
    id: '24',
    name: 'Abdominal Reto',
    muscle: 'Abdômen',
    description: 'Exercício básico para reto abdominal',
    videoUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '25',
    name: 'Prancha',
    muscle: 'Abdômen',
    description: 'Exercício isométrico para core',
    videoUrl: 'https://www.youtube.com/watch?v=TvxNkmjdhMM',
    lastWeight: 0,
    lastReps: 60,
    lastSets: 3
  },
  {
    id: '26',
    name: 'Abdominal Oblíquo',
    muscle: 'Abdômen',
    description: 'Trabalha os músculos oblíquos',
    videoUrl: 'https://www.youtube.com/watch?v=8ioA-ycHOCo',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '56',
    name: 'Russian Twist',
    muscle: 'Abdômen',
    description: 'Rotação para oblíquos e core',
    videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '57',
    name: 'Mountain Climber',
    muscle: 'Abdômen',
    description: 'Exercício dinâmico para core e cardio',
    videoUrl: 'https://www.youtube.com/watch?v=kLh-uczlPLg',
    lastWeight: 0,
    lastReps: 30,
    lastSets: 3
  },
  {
    id: '58',
    name: 'Dead Bug',
    muscle: 'Abdômen',
    description: 'Estabilização do core',
    videoUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '59',
    name: 'Elevação de Pernas',
    muscle: 'Abdômen',
    description: 'Foca na parte inferior do abdome',
    videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '60',
    name: 'Bicicleta',
    muscle: 'Abdômen',
    description: 'Movimento alternado para oblíquos',
    videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  
  // GLÚTEOS
  {
    id: '27',
    name: 'Elevação Pélvica (Hip Thrust)',
    muscle: 'Glúteos',
    description: 'Exercício principal para desenvolvimento dos glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=8BBEIfhl9y8',
    lastWeight: 80,
    lastReps: 10,
    lastSets: 4
  },
  {
    id: '28',
    name: 'Glute Bridge',
    muscle: 'Glúteos',
    description: 'Variação no chão focada em ativação dos glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=LM8XHLYJoYs',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '29',
    name: 'Agachamento Búlgaro',
    muscle: 'Glúteos',
    description: 'Unilateral que enfatiza glúteos e quadríceps',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    lastWeight: 20,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '30',
    name: 'Coice na Polia (Cable Kickback)',
    muscle: 'Glúteos',
    description: 'Isolamento dos glúteos com foco em extensão do quadril',
    videoUrl: 'https://www.youtube.com/watch?v=Qp4TnNsLa0s',
    lastWeight: 15,
    lastReps: 12,
    lastSets: 3
  },
  {
    id: '61',
    name: 'Abdução no Cabo',
    muscle: 'Glúteos',
    description: 'Isolamento do glúteo médio',
    videoUrl: 'https://www.youtube.com/watch?v=rGMv0U0ngSE',
    lastWeight: 10,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '62',
    name: 'Clamshell',
    muscle: 'Glúteos',
    description: 'Ativação do glúteo médio deitado',
    videoUrl: 'https://www.youtube.com/watch?v=ZlRrIsoDpKg',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },
  {
    id: '63',
    name: 'Single Leg Glute Bridge',
    muscle: 'Glúteos',
    description: 'Ponte unilateral para glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=AVAXhy6pl7o',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '64',
    name: 'Fire Hydrant',
    muscle: 'Glúteos',
    description: 'Exercício de ativação em quatro apoios',
    videoUrl: 'https://www.youtube.com/watch?v=SsJj5ExNDEs',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  },

  // CARDIO
  {
    id: '65',
    name: 'Burpee',
    muscle: 'Cardio',
    description: 'Exercício completo de alta intensidade',
    videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    lastWeight: 0,
    lastReps: 10,
    lastSets: 3
  },
  {
    id: '66',
    name: 'Jumping Jacks',
    muscle: 'Cardio',
    description: 'Movimento aeróbico clássico',
    videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    lastWeight: 0,
    lastReps: 30,
    lastSets: 3
  },
  {
    id: '67',
    name: 'High Knees',
    muscle: 'Cardio',
    description: 'Corrida estacionária com joelhos altos',
    videoUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-U',
    lastWeight: 0,
    lastReps: 30,
    lastSets: 3
  },
  {
    id: '68',
    name: 'Polichinelos',
    muscle: 'Cardio',
    description: 'Exercício aeróbico brasileiro tradicional',
    videoUrl: 'https://www.youtube.com/watch?v=UpH7rm0cYbM',
    lastWeight: 0,
    lastReps: 30,
    lastSets: 3
  },
  {
    id: '69',
    name: 'Sprint no Lugar',
    muscle: 'Cardio',
    description: 'Corrida de alta intensidade parado',
    videoUrl: 'https://www.youtube.com/watch?v=hxldG9FX4j4',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '70',
    name: 'Box Steps',
    muscle: 'Cardio',
    description: 'Subida e descida em plataforma',
    videoUrl: 'https://www.youtube.com/watch?v=dQqApCGd5Ss',
    lastWeight: 0,
    lastReps: 20,
    lastSets: 3
  },
  {
    id: '71',
    name: 'Corda (Simulação)',
    muscle: 'Cardio',
    description: 'Simulação de pular corda',
    videoUrl: 'https://www.youtube.com/watch?v=hCuXWQZj6WM',
    lastWeight: 0,
    lastReps: 60,
    lastSets: 3
  },
  {
    id: '72',
    name: 'Squat Jump',
    muscle: 'Cardio',
    description: 'Agachamento com salto explosivo',
    videoUrl: 'https://www.youtube.com/watch?v=YQq10-5u8QE',
    lastWeight: 0,
    lastReps: 15,
    lastSets: 3
  }
];

export function useWorkout() {
  const { user } = useAuth();
  const [exercises] = useState<Exercise[]>(mockExercises);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('Todos');
  const [loading, setLoading] = useState(false);

  // Load workout history from localStorage and potentially Supabase
  useEffect(() => {
    loadWorkoutHistory();
  }, [user]);

  const loadWorkoutHistory = async () => {
    setLoading(true);
    try {
      // Load from localStorage first
      const localHistory = localStorage.getItem('workout_history');
      if (localHistory) {
        const parsed = JSON.parse(localHistory);
        setWorkoutHistory(parsed.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        })));
      }

      // TODO: When we have Supabase access, load from database
      // if (user) {
      //   const { data, error } = await supabase
      //     .from('workout_sessions')
      //     .select('*')
      //     .eq('user_id', user.id)
      //     .order('date', { ascending: false });
      //   if (data && !error) {
      //     setWorkoutHistory(data);
      //   }
      // }
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkoutSession = async (session: WorkoutSession) => {
    try {
      // Save to localStorage
      const updatedHistory = [session, ...workoutHistory];
      localStorage.setItem('workout_history', JSON.stringify(updatedHistory));
      
      // TODO: When we have Supabase access, save to database
      // if (user) {
      //   await supabase.from('workout_sessions').insert({
      //     user_id: user.id,
      //     date: session.date,
      //     sets: session.sets,
      //     duration: session.duration
      //   });
      // }
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  };

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

  const finishWorkout = useCallback(async () => {
    if (currentSets.length > 0) {
      const session: WorkoutSession = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        sets: currentSets
      };
      
      setWorkoutHistory(prev => [session, ...prev]);
      await saveWorkoutSession(session);
      setCurrentSets([]);
    }
  }, [currentSets, workoutHistory]);

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
    loading,
    addSet,
    finishWorkout,
    getCurrentSetsForExercise,
    getFilteredExercises,
    getMuscleGroups,
    setSelectedMuscleGroup,
    loadWorkoutHistory
  };
}