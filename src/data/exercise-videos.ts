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
  // PEITO
  {
    exerciseId: '1', // Supino Reto
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3M4',
    description: 'Supino Reto com Barra - Técnica Correta'
  },
  {
    exerciseId: '2', // Supino Inclinado  
    youtubeUrl: 'https://www.youtube.com/watch?v=IP1b5AjZk74',
    description: 'Supino Inclinado - Execução Perfeita'
  },
  {
    exerciseId: '31', // Supino Declinado
    youtubeUrl: 'https://www.youtube.com/watch?v=Dqf4DiJIcxs',
    description: 'Supino Declinado - Como Fazer'
  },
  {
    exerciseId: '4', // Flexão
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Flexão de Braço - Técnica Correta'
  },
  {
    exerciseId: '5', // Flexão Diamante
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    description: 'Flexão Diamante - Como Executar'
  },
  {
    exerciseId: '6', // Crucifixo
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    description: 'Crucifixo com Halteres - Técnica'
  },
  {
    exerciseId: '7', // Crossover
    youtubeUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    description: 'Crossover - Exercício para Peito'
  },
  {
    exerciseId: '8', // Pec Deck
    youtubeUrl: 'https://www.youtube.com/watch?v=Z8SACXPX7zU',
    description: 'Pec Deck - Voador Máquina'
  },
  
  // COSTAS
  {
    exerciseId: '9', // Remada Curvada
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    description: 'Remada Curvada - Técnica Perfeita'
  },
  {
    exerciseId: '10', // Remada Sentada
    youtubeUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    description: 'Remada Sentada na Máquina'
  },
  {
    exerciseId: '11', // Pulldown
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pulldown - Puxada no Cabo'
  },
  {
    exerciseId: '12', // Barra Fixa
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Barra Fixa - Como Fazer'
  },
  {
    exerciseId: '13', // Remada Unilateral
    youtubeUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
    description: 'Remada Unilateral com Halter'
  },
  {
    exerciseId: '17', // Levantamento Terra
    youtubeUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE',
    description: 'Levantamento Terra - Técnica Completa'
  },
  
  // PERNAS
  {
    exerciseId: '18', // Agachamento
    youtubeUrl: 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    description: 'Agachamento Livre - Como Fazer'
  },
  {
    exerciseId: '19', // Leg Press
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    description: 'Leg Press 45° - Execução Correta'
  },
  {
    exerciseId: '20', // Extensão de Pernas
    youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Cadeira Extensora - Técnica'
  },
  {
    exerciseId: '21', // Mesa Flexora
    youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    description: 'Mesa Flexora - Como Fazer'
  },
  {
    exerciseId: '23', // Stiff
    youtubeUrl: 'https://www.youtube.com/watch?v=DN7GL46y07o',
    description: 'Stiff - Levantamento Romeno'
  },
  {
    exerciseId: '24', // Agachamento Frontal
    youtubeUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0',
    description: 'Agachamento Frontal - Técnica'
  },
  {
    exerciseId: '25', // Afundo
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    description: 'Afundo - Como Executar'
  },
  
  // OMBROS
  {
    exerciseId: '33', // Desenvolvimento
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Desenvolvimento de Ombros'
  },
  {
    exerciseId: '34', // Elevação Frontal
    youtubeUrl: 'https://www.youtube.com/watch?v=_QnwAoesJvQ',
    description: 'Elevação Frontal com Halteres'
  },
  {
    exerciseId: '35', // Elevação Lateral
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Elevação Lateral - Como Fazer'
  },
  {
    exerciseId: '36', // Elevação Posterior
    youtubeUrl: 'https://www.youtube.com/watch?v=ttvfGg9d76c',
    description: 'Elevação Posterior - Deltoide'
  },
  
  // BÍCEPS
  {
    exerciseId: '41', // Rosca Direta
    youtubeUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    description: 'Rosca Direta - Técnica Perfeita'
  },
  {
    exerciseId: '42', // Rosca Martelo
    youtubeUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    description: 'Rosca Martelo - Como Fazer'
  },
  {
    exerciseId: '44', // Rosca Concentrada
    youtubeUrl: 'https://www.youtube.com/watch?v=Jyj7415EzG8',
    description: 'Rosca Concentrada - Técnica'
  },
  {
    exerciseId: '45', // Rosca 21
    youtubeUrl: 'https://www.youtube.com/watch?v=uO_VZrOKgd4',
    description: 'Rosca 21 - Como Executar'
  },
  
  // TRÍCEPS
  {
    exerciseId: '48', // Mergulho
    youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    description: 'Mergulho no Banco - Tríceps'
  },
  {
    exerciseId: '49', // Tríceps Pulley
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    description: 'Tríceps Pulley - Como Executar'
  },
  {
    exerciseId: '50', // Tríceps Francês
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    description: 'Tríceps Francês - Técnica'
  },
  
  // ABDÔMEN
  {
    exerciseId: '54', // Abdominal
    youtubeUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    description: 'Abdominal Tradicional - Técnica'
  },
  {
    exerciseId: '55', // Prancha
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Prancha Abdominal - Como Fazer'
  },
  {
    exerciseId: '57', // Russian Twist
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    description: 'Russian Twist - Oblíquos'
  },
  
  // GLÚTEO
  {
    exerciseId: '62', // Hip Thrust
    youtubeUrl: 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    description: 'Elevação Pélvica - Hip Thrust'
  },
  {
    exerciseId: '63', // Glute Bridge
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    description: 'Ponte de Glúteo - Ativação'
  },
  
  // CARDIO
  {
    exerciseId: '69', // Jumping Jacks
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Jumping Jacks - Exercício Cardiovascular'
  },
  {
    exerciseId: '70', // High Knees
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    description: 'High Knees - Elevação de Joelhos'
  },

  // EXERCÍCIOS COMPLEMENTARES
  {
    exerciseId: '3', // Flexão Inclinada
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Flexão Inclinada - Demonstração'
  },
  {
    exerciseId: '14', // Pulldown Pegada Aberta
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pulldown Pegada Aberta'
  },
  {
    exerciseId: '15', // Pull Down Pegada Neutra
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pull Down Pegada Neutra'
  },
  {
    exerciseId: '16', // Pulley Alto
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pulley Alto'
  },
  {
    exerciseId: '22', // Elevação Panturrilha
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    description: 'Elevação Panturrilha'
  },
  {
    exerciseId: '26', // Hack Squat
    youtubeUrl: 'https://www.youtube.com/watch?v=EdtaJRBqsI4',
    description: 'Hack Squat'
  },
  {
    exerciseId: '27', // Passada
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    description: 'Passada'
  },
  {
    exerciseId: '28', // Panturrilha Sentada
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    description: 'Panturrilha Sentada'
  },
  {
    exerciseId: '29', // Agachamento Búlgaro
    youtubeUrl: 'https://www.youtube.com/watch?v=2FuEF8R8FcY',
    description: 'Agachamento Búlgaro'
  },
  {
    exerciseId: '30', // Coice na Polia
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Coice na Polia'
  },
  {
    exerciseId: '32', // Flexão Fechada
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Flexão Fechada'
  },
  {
    exerciseId: '37', // Desenvolvimento Arnold
    youtubeUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    description: 'Desenvolvimento Arnold'
  },
  {
    exerciseId: '38', // Remada Alta
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Remada Alta'
  },
  {
    exerciseId: '39', // Face Pull
    youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    description: 'Face Pull'
  },
  {
    exerciseId: '40', // Encolhimento
    youtubeUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    description: 'Encolhimento'
  },
  {
    exerciseId: '43', // Rosca Scott
    youtubeUrl: 'https://www.youtube.com/watch?v=fIWP-FRFKU0',
    description: 'Rosca Scott'
  },
  {
    exerciseId: '46', // Rosca no Cabo
    youtubeUrl: 'https://www.youtube.com/watch?v=R-1gfgWEKO0',
    description: 'Rosca no Cabo'
  },
  {
    exerciseId: '47', // Rosca Inversa
    youtubeUrl: 'https://www.youtube.com/watch?v=nRiO5qyf8oE',
    description: 'Rosca Inversa'
  },
  {
    exerciseId: '51', // Tríceps Testa
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    description: 'Tríceps Testa'
  },
  {
    exerciseId: '52', // Tríceps Coice
    youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
    description: 'Tríceps Coice'
  },
  {
    exerciseId: '53', // Tríceps Corda
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    description: 'Tríceps Corda'
  },
  {
    exerciseId: '56', // Abdominal Oblíquo
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    description: 'Abdominal Oblíquo'
  },
  {
    exerciseId: '58', // Mountain Climber
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    description: 'Mountain Climber'
  },
  {
    exerciseId: '59', // Dead Bug
    youtubeUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    description: 'Dead Bug'
  },
  {
    exerciseId: '60', // Elevação de Pernas
    youtubeUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    description: 'Elevação de Pernas'
  },
  {
    exerciseId: '61', // Bicicleta
    youtubeUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    description: 'Bicicleta'
  },
  {
    exerciseId: '64', // Calf Raise
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    description: 'Calf Raise'
  },
  {
    exerciseId: '65', // Abdução no Cabo
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Abdução no Cabo'
  },
  {
    exerciseId: '66', // Clamshell
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Clamshell'
  },
  {
    exerciseId: '67', // Single Leg Glute Bridge
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    description: 'Single Leg Glute Bridge'
  },
  {
    exerciseId: '68', // Fire Hydrant
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Fire Hydrant'
  },
  {
    exerciseId: '71', // Polichinelos
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Polichinelos'
  },
  {
    exerciseId: '72', // Sprint no Lugar
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    description: 'Sprint no Lugar'
  },
  {
    exerciseId: '73', // Box Steps
    youtubeUrl: 'https://www.youtube.com/watch?v=WNs3v7a8Xp8',
    description: 'Box Steps'
  },
  {
    exerciseId: '74', // Corda (Simulação)
    youtubeUrl: 'https://www.youtube.com/watch?v=1BZM2Vre5oc',
    description: 'Corda (Simulação)'
  },
  {
    exerciseId: '75', // Squat Jump
    youtubeUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    description: 'Squat Jump'
  }
];

// Funções auxiliares do sistema de vídeos
export function getExerciseVideo(exerciseId: string): ExerciseVideo | undefined {
  return exerciseVideos.find(video => video.exerciseId === exerciseId);
}

export function getVideoUrl(exerciseId: string): string | undefined {
  const video = getExerciseVideo(exerciseId);
  if (!video) return undefined;

  // Prioridade: YouTube > fallback local
  return video.youtubeUrl || video.fallbackVideoPath;
}

export function isLocalVideo(videoUrl: string): boolean {
  return videoUrl.startsWith('/videos/') || videoUrl.startsWith('./videos/');
}

export function getGenericVideoByMuscleGroup(muscleGroup: string): string {
  const genericVideos: Record<string, string> = {
    'Peito': 'https://www.youtube.com/watch?v=rT7DgCr-3M4',
    'Costas': 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ', 
    'Pernas': 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    'Ombros': 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    'Bíceps': 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    'Tríceps': 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    'Abdômen': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'Glúteo': 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    'Cardio': 'https://www.youtube.com/watch?v=c4DAnQ6DtF8'
  };
  
  return genericVideos[muscleGroup] || 'https://www.youtube.com/watch?v=rT7DgCr-3M4';
}

// Sistema 100% YouTube - sem dependência de arquivos locais