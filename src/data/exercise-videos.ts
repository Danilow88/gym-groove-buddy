// Mapeamento de vídeos locais para exercícios
// Para demonstração, usando vídeos genéricos que representam os movimentos

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
    localVideoPath: '/videos/exercises/bench-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3M4',
    description: 'Supino Reto - Técnica correta com Leandro Twin'
  },
  {
    exerciseId: '2', // Supino Inclinado
    localVideoPath: '/videos/exercises/incline-bench-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=IP9KOwTGgH4',
    description: 'Supino Inclinado - Como fazer corretamente'
  },
  {
    exerciseId: '3', // Flexão de Braço
    localVideoPath: '/videos/exercises/pushup.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N6nI',
    description: 'Flexão de Braço - Técnica perfeita'
  },
  {
    exerciseId: '4', // Crucifixo
    localVideoPath: '/videos/exercises/dumbbell-fly.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    description: 'Crucifixo com halteres - Execução correta'
  },
  {
    exerciseId: '30', // Supino Declinado
    youtubeUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE',
    description: 'Supino Declinado - Técnica e benefícios'
  },

  // COSTAS
  {
    exerciseId: '5', // Remada Curvada
    localVideoPath: '/videos/exercises/bent-over-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=9efgcAjQe7E',
    description: 'Remada Curvada - Técnica com Leandro Twin'
  },
  {
    exerciseId: '6', // Pull Down
    localVideoPath: '/videos/exercises/lat-pulldown.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    description: 'Pull Down - Puxada alta frontal'
  },
  {
    exerciseId: '7', // Remada Baixa
    localVideoPath: '/videos/exercises/cable-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    description: 'Remada Baixa - Execução no cabo'
  },
  {
    exerciseId: '8', // Barra Fixa
    localVideoPath: '/videos/exercises/barra-fixa.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Barra Fixa - Como fazer corretamente'
  },

  // PERNAS
  {
    exerciseId: '9', // Agachamento
    localVideoPath: '/videos/exercises/squat.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    description: 'Agachamento - Técnica perfeita'
  },
  {
    exerciseId: '10', // Leg Press
    localVideoPath: '/videos/exercises/leg-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    description: 'Leg Press - Posicionamento dos pés'
  },
  {
    exerciseId: '11', // Stiff
    localVideoPath: '/videos/exercises/stiff.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=1uDiW5--rFE',
    description: 'Stiff - Levantamento terra romeno'
  },
  {
    exerciseId: '12', // Leg Curl
    localVideoPath: '/videos/exercises/leg-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=ELOCsoDSmrg',
    description: 'Leg Curl - Mesa flexora'
  },
  {
    exerciseId: '13', // Leg Extension
    localVideoPath: '/videos/exercises/leg-extension.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Leg Extension - Cadeira extensora'
  },

  // OMBROS
  {
    exerciseId: '14', // Desenvolvimento
    localVideoPath: '/videos/exercises/shoulder-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Desenvolvimento de Ombros - Militar'
  },
  {
    exerciseId: '15', // Elevação Lateral
    localVideoPath: '/videos/exercises/lateral-raise.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Elevação Lateral - Técnica correta'
  },
  {
    exerciseId: '16', // Elevação Frontal
    localVideoPath: '/videos/exercises/front-raise.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=qzaKGWWKXEw',
    description: 'Elevação Frontal - Ombro anterior'
  },
  {
    exerciseId: '17', // Desenvolvimento Arnold
    localVideoPath: '/videos/exercises/desenvolvimento-arnold.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    description: 'Desenvolvimento Arnold - Variação completa'
  },

  // BÍCEPS
  {
    exerciseId: '18', // Rosca Direta
    localVideoPath: '/videos/exercises/bicep-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-curl.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Rosca Direta - Bíceps com barra'
  },
  {
    exerciseId: '19', // Rosca Martelo
    localVideoPath: '/videos/exercises/hammer-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-curl.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=TwD-YGVP4Bk',
    description: 'Rosca Martelo - Pegada neutra'
  },
  {
    exerciseId: '20', // Rosca Concentrada
    localVideoPath: '/videos/exercises/rosca-concentrada.mp4',
    fallbackVideoPath: '/videos/exercises/generic-curl.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jk_E2290Kw',
    description: 'Rosca Concentrada - Isolamento do bíceps'
  },

  // TRÍCEPS
  {
    exerciseId: '21', // Tríceps Testa
    localVideoPath: '/videos/exercises/skull-crusher.mp4',
    fallbackVideoPath: '/videos/exercises/generic-tricep.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=nALyRHQP4qE',
    description: 'Tríceps Testa - Skull Crusher'
  },
  {
    exerciseId: '22', // Tríceps Pulley
    localVideoPath: '/videos/exercises/tricep-pushdown.mp4',
    fallbackVideoPath: '/videos/exercises/generic-tricep.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    description: 'Tríceps Pulley - Puxada no cabo'
  },
  {
    exerciseId: '23', // Tríceps Francês
    localVideoPath: '/videos/exercises/triceps-frances.mp4',
    fallbackVideoPath: '/videos/exercises/generic-tricep.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=fIWP-FRFKU0',
    description: 'Tríceps Francês - Com halter'
  },

  // ABDÔMEN
  {
    exerciseId: '24', // Abdominal Reto
    localVideoPath: '/videos/exercises/crunch.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    description: 'Abdominal Reto - Crunch tradicional'
  },
  {
    exerciseId: '25', // Prancha
    localVideoPath: '/videos/exercises/plank.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=TvxNkmjdhMM',
    description: 'Prancha - Core stability'
  },
  {
    exerciseId: '26', // Russian Twist
    localVideoPath: '/videos/exercises/russian-twist.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    description: 'Russian Twist - Oblíquos'
  },
  {
    exerciseId: '27', // Elevação de Pernas
    localVideoPath: '/videos/exercises/elevacao-pernas.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    description: 'Elevação de Pernas - Abdômen inferior'
  },

  // GLÚTEOS
  {
    exerciseId: '28', // Glute Bridge
    localVideoPath: '/videos/exercises/glute-bridge.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    description: 'Glute Bridge - Elevação pélvica'
  },
  {
    exerciseId: '29', // Hip Thrust
    localVideoPath: '/videos/exercises/hip-thrust.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
    description: 'Hip Thrust - Impulsão de quadril'
  }
];

// Função para obter o vídeo mais adequado para um exercício
export function getExerciseVideo(exerciseId: string): ExerciseVideo | null {
  return exerciseVideos.find(video => video.exerciseId === exerciseId) || null;
}

// Função para obter URL do vídeo com fallbacks
export function getVideoUrl(exerciseId: string): string | null {
  const video = getExerciseVideo(exerciseId);
  if (!video) return null;

  // Prioridade: youtube > local > fallback para vídeos online
  return video.youtubeUrl || video.localVideoPath || video.fallbackVideoPath || null;
}

// Função para verificar se o vídeo é local (offline)
export function isLocalVideo(videoUrl: string): boolean {
  return videoUrl.startsWith('/videos/') || videoUrl.startsWith('./videos/');
}

// Função para obter vídeo genérico baseado no tipo de exercício
export function getGenericVideoByMuscleGroup(muscleGroup: string): string {
  const genericVideos: Record<string, string> = {
    'Peito': '/videos/exercises/generic-push.mp4',
    'Costas': '/videos/exercises/generic-pull.mp4', 
    'Pernas': '/videos/exercises/generic-squat.mp4',
    'Ombros': '/videos/exercises/generic-press.mp4',
    'Bíceps': '/videos/exercises/generic-curl.mp4',
    'Tríceps': '/videos/exercises/generic-tricep.mp4',
    'Abdômen': '/videos/exercises/generic-abs.mp4',
    'Glúteos': '/videos/exercises/generic-squat.mp4',
    'Cardio': '/videos/exercises/generic-cardio.mp4'
  };

  return genericVideos[muscleGroup] || '/videos/exercises/generic-workout.mp4';
}
