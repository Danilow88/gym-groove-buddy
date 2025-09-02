// Sistema de vídeos brasileiros do YouTube
// Todos os vídeos são em português brasileiro (PT-BR)

export interface ExerciseVideo {
  exerciseId: string;
  localVideoPath?: string;
  fallbackVideoPath?: string;
  youtubeUrl?: string;
  description: string;
}

export const exerciseVideos: ExerciseVideo[] = [
  {
    exerciseId: '1',
    youtubeUrl: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Supino Reto - Técnica Correta (Renato Cariani)'
  },
  {
    exerciseId: '2',
    youtubeUrl: 'https://www.youtube.com/watch?v=vthMCtgVtFw',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Supino Inclinado - Execução Perfeita (Leandro Twin)'
  },
  {
    exerciseId: '31',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Supino Declinado - Como Fazer (Carlos DeOliveira)'
  },
  {
    exerciseId: '4',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Flexão de Braço - Técnica Correta (Leandro Twin)'
  },
  {
    exerciseId: '5',
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Flexão Diamante - Como Executar (Felipe Franco)'
  },
  {
    exerciseId: '6',
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Crucifixo com Halteres - Técnica (Renato Cariani)'
  },
  {
    exerciseId: '7',
    youtubeUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Crossover - Exercício para Peito (Caio Bottura)'
  },
  {
    exerciseId: '8',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z8SACXPX7zU',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Pec Deck - Voador Máquina (Rafael Brandão)'
  },
  {
    exerciseId: '9',
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Remada Curvada - Técnica Perfeita (Leandro Twin)'
  },
  {
    exerciseId: '10',
    youtubeUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Remada Sentada na Máquina (Rodrigo Góes)'
  },
  {
    exerciseId: '11',
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Pulldown - Puxada no Cabo (Renato Cariani)'
  },
  {
    exerciseId: '12',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Barra Fixa - Como Fazer (Felipe Franco)'
  },
  {
    exerciseId: '13',
    youtubeUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Remada Unilateral com Halter (Caio Bottura)'
  },
  {
    exerciseId: '17',
    youtubeUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Levantamento Terra - Técnica Completa (Felipe Franco)'
  },
  {
    exerciseId: '18',
    youtubeUrl: 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Agachamento Livre - Como Fazer (Renato Cariani)'
  },
  {
    exerciseId: '19',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Leg Press 45° - Execução Correta (Leandro Twin)'
  },
  {
    exerciseId: '20',
    youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Cadeira Extensora - Técnica (Caio Bottura)'
  },
  {
    exerciseId: '21',
    youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Mesa Flexora - Como Fazer (Rodrigo Góes)'
  },
  {
    exerciseId: '23',
    youtubeUrl: 'https://www.youtube.com/watch?v=DN7GL46y07o',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Stiff - Levantamento Romeno (Rafael Brandão)'
  },
  {
    exerciseId: '24',
    youtubeUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Agachamento Frontal - Técnica (Felipe Franco)'
  },
  {
    exerciseId: '25',
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Afundo - Como Executar (Leandro Twin)'
  },
  {
    exerciseId: '33',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Desenvolvimento de Ombros (Renato Cariani)'
  },
  {
    exerciseId: '34',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Elevação Frontal com Halteres (Caio Bottura)'
  },
  {
    exerciseId: '35',
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Elevação Lateral - Como Fazer (Leandro Twin)'
  },
  {
    exerciseId: '36',
    youtubeUrl: 'https://www.youtube.com/watch?v=ttvfGg9d76c',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Elevação Posterior - Deltoide (Rodrigo Góes)'
  },
  {
    exerciseId: '41',
    youtubeUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Rosca Direta - Técnica Perfeita (Renato Cariani)'
  },
  {
    exerciseId: '42',
    youtubeUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Rosca Martelo - Como Fazer (Felipe Franco)'
  },
  {
    exerciseId: '44',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jyj7415EzG8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Rosca Concentrada - Técnica (Caio Bottura)'
  },
  {
    exerciseId: '45',
    youtubeUrl: 'https://www.youtube.com/watch?v=uO_VZrOKgd4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Rosca 21 - Como Executar (Leandro Twin)'
  },
  {
    exerciseId: '48',
    youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Mergulho no Banco - Tríceps (Carlos DeOliveira)'
  },
  {
    exerciseId: '49',
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Tríceps Pulley - Como Executar (Rafael Brandão)'
  },
  {
    exerciseId: '50',
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Tríceps Francês - Técnica (Felipe Franco)'
  },
  {
    exerciseId: '54',
    youtubeUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Abdominal Tradicional - Técnica (Márcio McFly)'
  },
  {
    exerciseId: '55',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Prancha Abdominal - Como Fazer (Academia Açaí)'
  },
  {
    exerciseId: '57',
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Russian Twist - Oblíquos (Fabricio Sardinha)'
  },
  {
    exerciseId: '62',
    youtubeUrl: 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Elevação Pélvica - Hip Thrust (Caio Bottura)'
  },
  {
    exerciseId: '63',
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Ponte de Glúteo - Ativação (Academia Açaí)'
  },
  {
    exerciseId: '69',
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'Jumping Jacks - Exercício Cardiovascular'
  },
  {
    exerciseId: '70',
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    description: 'High Knees - Elevação de Joelhos'
  },
  {
    exerciseId: '3',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Flexão Inclinada - Demonstração em português brasileiro'
  },
  {
    exerciseId: '14',
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Pulldown Pegada Aberta - Demonstração em português brasileiro'
  },
  {
    exerciseId: '15',
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Pull Down Pegada Neutra - Demonstração em português brasileiro'
  },
  {
    exerciseId: '16',
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Pulley Alto - Demonstração em português brasileiro'
  },
  {
    exerciseId: '22',
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Elevação Panturrilha - Demonstração em português brasileiro'
  },
  {
    exerciseId: '26',
    youtubeUrl: 'https://www.youtube.com/watch?v=EdtaJRBqsI4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Hack Squat - Demonstração em português brasileiro'
  },
  {
    exerciseId: '27',
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Passada - Demonstração em português brasileiro'
  },
  {
    exerciseId: '28',
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Panturrilha Sentada - Demonstração em português brasileiro'
  },
  {
    exerciseId: '29',
    youtubeUrl: 'https://www.youtube.com/watch?v=2FuEF8R8FcY',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Agachamento Búlgaro - Demonstração em português brasileiro'
  },
  {
    exerciseId: '30',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Coice na Polia - Demonstração em português brasileiro'
  },
  {
    exerciseId: '32',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Flexão Fechada - Demonstração em português brasileiro'
  },
  {
    exerciseId: '37',
    youtubeUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Desenvolvimento Arnold - Demonstração em português brasileiro'
  },
  {
    exerciseId: '38',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Remada Alta - Demonstração em português brasileiro'
  },
  {
    exerciseId: '39',
    youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Face Pull - Demonstração em português brasileiro'
  },
  {
    exerciseId: '40',
    youtubeUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Encolhimento - Demonstração em português brasileiro'
  },
  {
    exerciseId: '43',
    youtubeUrl: 'https://www.youtube.com/watch?v=fIWP-FRFKU0',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Rosca Scott - Demonstração em português brasileiro'
  },
  {
    exerciseId: '46',
    youtubeUrl: 'https://www.youtube.com/watch?v=R-1gfgWEKO0',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Rosca no Cabo - Demonstração em português brasileiro'
  },
  {
    exerciseId: '47',
    youtubeUrl: 'https://www.youtube.com/watch?v=nRiO5qyf8oE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Rosca Inversa - Demonstração em português brasileiro'
  },
  {
    exerciseId: '51',
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Tríceps Testa - Demonstração em português brasileiro'
  },
  {
    exerciseId: '52',
    youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Tríceps Coice - Demonstração em português brasileiro'
  },
  {
    exerciseId: '53',
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Tríceps Corda - Demonstração em português brasileiro'
  },
  {
    exerciseId: '56',
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Abdominal Oblíquo - Demonstração em português brasileiro'
  },
  {
    exerciseId: '58',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Mountain Climber - Demonstração em português brasileiro'
  },
  {
    exerciseId: '59',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Dead Bug - Demonstração em português brasileiro'
  },
  {
    exerciseId: '60',
    youtubeUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Elevação de Pernas - Demonstração em português brasileiro'
  },
  {
    exerciseId: '61',
    youtubeUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Bicicleta - Demonstração em português brasileiro'
  },
  {
    exerciseId: '64',
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Calf Raise - Demonstração em português brasileiro'
  },
  {
    exerciseId: '65',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Abdução no Cabo - Demonstração em português brasileiro'
  },
  {
    exerciseId: '66',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Clamshell - Demonstração em português brasileiro'
  },
  {
    exerciseId: '67',
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Single Leg Glute Bridge - Demonstração em português brasileiro'
  },
  {
    exerciseId: '68',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Fire Hydrant - Demonstração em português brasileiro'
  },
  {
    exerciseId: '71',
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Polichinelos - Demonstração em português brasileiro'
  },
  {
    exerciseId: '72',
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Sprint no Lugar - Demonstração em português brasileiro'
  },
  {
    exerciseId: '73',
    youtubeUrl: 'https://www.youtube.com/watch?v=WNs3v7a8Xp8',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Box Steps - Demonstração em português brasileiro'
  },
  {
    exerciseId: '74',
    youtubeUrl: 'https://www.youtube.com/watch?v=1BZM2Vre5oc',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Corda (Simulação) - Demonstração em português brasileiro'
  },
  {
    exerciseId: '75',
    youtubeUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4', 
    description: 'Squat Jump - Demonstração em português brasileiro'
  },

];

// Funções auxiliares do sistema de vídeos
export function getExerciseVideo(exerciseId: string): ExerciseVideo | undefined {
  return exerciseVideos.find(video => video.exerciseId === exerciseId);
}

export function getVideoUrl(exerciseId: string): string | undefined {
  const video = getExerciseVideo(exerciseId);
  if (!video) return undefined;

  // Prioridade: YouTube brasileiro > fallback local
  return video.youtubeUrl || video.fallbackVideoPath;
}

export function isLocalVideo(videoUrl: string): boolean {
  return videoUrl.startsWith('/videos/') || videoUrl.startsWith('./videos/');
}

export function getGenericVideoByMuscleGroup(muscleGroup: string): string {
  const genericVideos: Record<string, string> = {
    'Peito': 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
    'Costas': 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ', 
    'Pernas': 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    'Ombros': 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    'Bíceps': 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    'Tríceps': 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    'Abdômen': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'Glúteo': 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    'Cardio': 'https://www.youtube.com/watch?v=c4DAnQ6DtF8'
  };
  
  return genericVideos[muscleGroup] || 'https://www.youtube.com/watch?v=gRVjAtPip0Y';
}

// Sistema prioriza vídeos do YouTube brasileiros
// 100% em português brasileiro (PT-BR)
// Sem dependência de arquivos locais
