import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  muscleGroup: string;
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

export const mockExercises: Exercise[] = [
  // PEITO
  {
    id: '1',
    name: 'Supino Reto',
    muscle: 'Peito',
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Peito',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Costas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Pernas',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Ombros',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Bíceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Tríceps',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Abdômen',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Glúteos',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
    muscleGroup: 'Cardio',
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
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);

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

      // Load from Supabase
      if (user) {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            workout_sets (*)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (data && !error) {
          const transformedHistory = data.map(session => ({
            id: session.id,
            date: new Date(session.date),
            duration: session.duration || 0,
            sets: (session.workout_sets || []).map((set: any) => ({
              id: set.id,
              exerciseId: set.exercise_id,
              weight: set.weight,
              reps: set.reps,
              timestamp: new Date(set.timestamp)
            }))
          }));
          setWorkoutHistory(transformedHistory);
        }
      }
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
      
      // Save to Supabase
      if (user) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .insert([{
            user_id: user.id,
            date: session.date.toISOString(),
            duration: session.duration
          }])
          .select()
          .single();

        if (sessionData && !sessionError) {
          // Save workout sets
          const setsData = session.sets.map(set => ({
            session_id: sessionData.id,
            exercise_id: set.exerciseId,
            weight: set.weight,
            reps: set.reps,
            timestamp: new Date().toISOString()
          }));

          await supabase.from('workout_sets').insert(setsData);
        }
      }
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
    setCurrentSets(prev => {
      // Inicia o cronômetro do treino se for o primeiro set
      if (prev.length === 0) {
        setWorkoutStartTime(Date.now());
      }
      return [...prev, newSet];
    });
  }, []);

  const removeSet = useCallback((setId: string) => {
    setCurrentSets(prev => {
      const newSets = prev.filter(set => set.id !== setId);
      // Se não há mais sets, reseta o tempo de início
      if (newSets.length === 0) {
        setWorkoutStartTime(null);
      }
      return newSets;
    });
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
      setWorkoutStartTime(null);
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
    workoutStartTime,
    addSet,
    removeSet,
    finishWorkout,
    getCurrentSetsForExercise,
    getFilteredExercises,
    getMuscleGroups,
    setSelectedMuscleGroup,
    loadWorkoutHistory
  };
}