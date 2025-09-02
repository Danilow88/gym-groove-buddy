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
    exerciseId: '3', // Flexão de Braço
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Flexão de Braço - Técnica Correta'
  },
  {
    exerciseId: '4', // Crucifixo
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    description: 'Crucifixo com Halteres - Técnica'
  },
  {
    exerciseId: '31', // Supino Declinado
    youtubeUrl: 'https://www.youtube.com/watch?v=Dqf4DiJIcxs',
    description: 'Supino Declinado - Como Fazer'
  },
  {
    exerciseId: '32', // Crossover
    youtubeUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    description: 'Crossover - Exercício para Peito'
  },
  {
    exerciseId: '33', // Flexão Diamante
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    description: 'Flexão Diamante - Como Executar'
  },
  {
    exerciseId: '34', // Pec Deck
    youtubeUrl: 'https://www.youtube.com/watch?v=Z8SACXPX7zU',
    description: 'Pec Deck - Voador Máquina'
  },
  
  // COSTAS
  {
    exerciseId: '5', // Remada Curvada
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    description: 'Remada Curvada - Técnica Perfeita'
  },
  {
    exerciseId: '6', // Pull Down
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pulldown - Puxada no Cabo'
  },
  {
    exerciseId: '7', // Remada Baixa
    youtubeUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    description: 'Remada Baixa na Máquina'
  },
  {
    exerciseId: '8', // Levantamento Terra
    youtubeUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE',
    description: 'Levantamento Terra - Técnica Completa'
  },
  {
    exerciseId: '35', // Barra Fixa
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Barra Fixa - Como Fazer'
  },
  {
    exerciseId: '36', // Remada Unilateral
    youtubeUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
    description: 'Remada Unilateral com Halter'
  },
  {
    exerciseId: '37', // Pull Down Pegada Neutra
    youtubeUrl: 'https://www.youtube.com/watch?v=lueEJGjTuPQ',
    description: 'Pull Down Pegada Neutra'
  },
  {
    exerciseId: '38', // Pulley Alto
    youtubeUrl: 'https://www.youtube.com/watch?v=6yMdhi2DVao',
    description: 'Pulley Alto'
  },
  
  // PERNAS
  {
    exerciseId: '9', // Agachamento
    youtubeUrl: 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    description: 'Agachamento Livre - Como Fazer'
  },
  {
    exerciseId: '10', // Leg Press
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    description: 'Leg Press 45° - Execução Correta'
  },
  {
    exerciseId: '11', // Extensão de Pernas
    youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Cadeira Extensora - Técnica'
  },
  {
    exerciseId: '12', // Mesa Flexora
    youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    description: 'Mesa Flexora - Como Fazer'
  },
  {
    exerciseId: '13', // Elevação Panturrilha
    youtubeUrl: 'https://www.youtube.com/watch?v=gwWv7aPcD5c',
    description: 'Elevação Panturrilha'
  },
  {
    exerciseId: '39', // Agachamento Frontal
    youtubeUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0',
    description: 'Agachamento Frontal - Técnica'
  },
  {
    exerciseId: '40', // Stiff
    youtubeUrl: 'https://www.youtube.com/watch?v=DN7GL46y07o',
    description: 'Stiff - Levantamento Romeno'
  },
  {
    exerciseId: '41', // Afundo
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    description: 'Afundo - Como Executar'
  },
  {
    exerciseId: '42', // Hack Squat
    youtubeUrl: 'https://www.youtube.com/watch?v=EdtaJRBqsI4',
    description: 'Hack Squat'
  },
  {
    exerciseId: '43', // Passada
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    description: 'Passada'
  },
  
  // OMBROS
  {
    exerciseId: '14', // Desenvolvimento
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Desenvolvimento de Ombros'
  },
  {
    exerciseId: '15', // Elevação Lateral
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Elevação Lateral - Como Fazer'
  },
  {
    exerciseId: '16', // Elevação Frontal
    youtubeUrl: 'https://www.youtube.com/watch?v=_QnwAoesJvQ',
    description: 'Elevação Frontal com Halteres'
  },
  {
    exerciseId: '17', // Elevação Posterior
    youtubeUrl: 'https://www.youtube.com/watch?v=ttvfGg9d76c',
    description: 'Elevação Posterior - Deltoide'
  },
  {
    exerciseId: '44', // Desenvolvimento Arnold
    youtubeUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    description: 'Desenvolvimento Arnold'
  },
  {
    exerciseId: '45', // Remada Alta
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Remada Alta'
  },
  {
    exerciseId: '46', // Face Pull
    youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    description: 'Face Pull'
  },
  {
    exerciseId: '47', // Encolhimento
    youtubeUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    description: 'Encolhimento'
  },
  
  // BÍCEPS
  {
    exerciseId: '18', // Rosca Direta
    youtubeUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    description: 'Rosca Direta - Técnica Perfeita'
  },
  {
    exerciseId: '19', // Rosca Martelo
    youtubeUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    description: 'Rosca Martelo - Como Fazer'
  },
  {
    exerciseId: '20', // Rosca Scott
    youtubeUrl: 'https://www.youtube.com/watch?v=fIWP-FRFKU0',
    description: 'Rosca Scott'
  },
  {
    exerciseId: '48', // Rosca Concentrada
    youtubeUrl: 'https://www.youtube.com/watch?v=Jyj7415EzG8',
    description: 'Rosca Concentrada - Técnica'
  },
  {
    exerciseId: '49', // Rosca 21
    youtubeUrl: 'https://www.youtube.com/watch?v=uO_VZrOKgd4',
    description: 'Rosca 21 - Como Executar'
  },
  {
    exerciseId: '50', // Rosca no Cabo
    youtubeUrl: 'https://www.youtube.com/watch?v=R-1gfgWEKO0',
    description: 'Rosca no Cabo'
  },
  {
    exerciseId: '51', // Rosca Inversa
    youtubeUrl: 'https://www.youtube.com/watch?v=nRiO5qyf8oE',
    description: 'Rosca Inversa'
  },
  
  // TRÍCEPS
  {
    exerciseId: '21', // Tríceps Testa
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    description: 'Tríceps Testa - Técnica'
  },
  {
    exerciseId: '22', // Mergulho
    youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    description: 'Mergulho no Banco - Tríceps'
  },
  {
    exerciseId: '23', // Tríceps Pulley
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    description: 'Tríceps Pulley - Como Executar'
  },
  {
    exerciseId: '52', // Tríceps Francês
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    description: 'Tríceps Francês - Técnica'
  },
  {
    exerciseId: '53', // Flexão Fechada
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Flexão Fechada'
  },
  {
    exerciseId: '54', // Tríceps Coice
    youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
    description: 'Tríceps Coice'
  },
  {
    exerciseId: '55', // Tríceps Corda
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    description: 'Tríceps Corda'
  },
  
  // ABDÔMEN
  {
    exerciseId: '24', // Abdominal Reto
    youtubeUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    description: 'Abdominal Reto - Técnica'
  },
  {
    exerciseId: '25', // Prancha
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Prancha Abdominal - Como Fazer'
  },
  {
    exerciseId: '26', // Abdominal Oblíquo
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    description: 'Abdominal Oblíquo'
  },
  {
    exerciseId: '56', // Russian Twist
    youtubeUrl: 'https://www.youtube.com/watch?v=8VIN4Hj7XlE',
    description: 'Russian Twist - Oblíquos'
  },
  {
    exerciseId: '57', // Mountain Climber
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    description: 'Mountain Climber'
  },
  {
    exerciseId: '58', // Dead Bug
    youtubeUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    description: 'Dead Bug'
  },
  {
    exerciseId: '59', // Elevação de Pernas
    youtubeUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    description: 'Elevação de Pernas'
  },
  {
    exerciseId: '60', // Bicicleta
    youtubeUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
    description: 'Bicicleta'
  },
  
  // GLÚTEOS
  {
    exerciseId: '27', // Hip Thrust
    youtubeUrl: 'https://www.youtube.com/watch?v=8gUsckqcKhM',
    description: 'Elevação Pélvica - Hip Thrust'
  },
  {
    exerciseId: '28', // Glute Bridge
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    description: 'Ponte de Glúteo - Ativação'
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
    exerciseId: '61', // Abdução no Cabo
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Abdução no Cabo'
  },
  {
    exerciseId: '62', // Clamshell
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Clamshell'
  },
  {
    exerciseId: '63', // Single Leg Glute Bridge
    youtubeUrl: 'https://www.youtube.com/watch?v=eQ7tY8QCQO4',
    description: 'Single Leg Glute Bridge'
  },
  {
    exerciseId: '64', // Fire Hydrant
    youtubeUrl: 'https://www.youtube.com/watch?v=Xm8Q8mlbKQ4',
    description: 'Fire Hydrant'
  },
  
  // CARDIO
  {
    exerciseId: '65', // Burpee
    youtubeUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    description: 'Burpee - Exercício Completo'
  },
  {
    exerciseId: '66', // Jumping Jacks
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Jumping Jacks - Exercício Cardiovascular'
  },
  {
    exerciseId: '67', // High Knees
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    description: 'High Knees - Elevação de Joelhos'
  },
  {
    exerciseId: '68', // Polichinelos
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Polichinelos'
  },
  {
    exerciseId: '69', // Sprint no Lugar
    youtubeUrl: 'https://www.youtube.com/watch?v=8opcQdC-V-g',
    description: 'Sprint no Lugar'
  },
  {
    exerciseId: '70', // Box Steps
    youtubeUrl: 'https://www.youtube.com/watch?v=WNs3v7a8Xp8',
    description: 'Box Steps'
  },
  {
    exerciseId: '71', // Corda (Simulação)
    youtubeUrl: 'https://www.youtube.com/watch?v=1BZM2Vre5oc',
    description: 'Corda (Simulação)'
  },
  {
    exerciseId: '72', // Squat Jump
    youtubeUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    description: 'Squat Jump'
  },

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