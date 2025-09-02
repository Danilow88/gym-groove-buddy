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
    youtubeUrl: 'https://www.youtube.com/watch?v=esQi683XR44',
    description: 'Demonstração do Supino Reto - técnica correta'
  },
  {
    exerciseId: '2', // Supino Inclinado
    localVideoPath: '/videos/exercises/incline-bench-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=DbFgADa2PL8',
    description: 'Demonstração do Supino Inclinado'
  },
  {
    exerciseId: '3', // Flexão de Braço
    localVideoPath: '/videos/exercises/pushup.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=mm_KOnjn6nU',
    description: 'Demonstração da Flexão de Braço'
  },
  {
    exerciseId: '4', // Crucifixo
    localVideoPath: '/videos/exercises/dumbbell-fly.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    description: 'Demonstração do Crucifixo com halteres'
  },

  // COSTAS
  {
    exerciseId: '5', // Remada Curvada
    localVideoPath: '/videos/exercises/bent-over-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=gQBSMH3GZJA',
    description: 'Demonstração da Remada Curvada'
  },
  {
    exerciseId: '6', // Pull Down
    localVideoPath: '/videos/exercises/lat-pulldown.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    description: 'Demonstração do Pull Down'
  },
  {
    exerciseId: '7', // Remada Baixa
    localVideoPath: '/videos/exercises/cable-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
    description: 'Demonstração da Remada Baixa'
  },

  // PERNAS
  {
    exerciseId: '9', // Agachamento
    localVideoPath: '/videos/exercises/squat.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    description: 'Demonstração do Agachamento'
  },
  {
    exerciseId: '10', // Leg Press
    localVideoPath: '/videos/exercises/leg-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    description: 'Demonstração do Leg Press'
  },

  // OMBROS
  {
    exerciseId: '14', // Desenvolvimento
    localVideoPath: '/videos/exercises/shoulder-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Demonstração do Desenvolvimento de Ombros'
  },
  {
    exerciseId: '15', // Elevação Lateral
    localVideoPath: '/videos/exercises/lateral-raise.mp4',
    fallbackVideoPath: '/videos/exercises/generic-press.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Demonstração da Elevação Lateral'
  },

  // BÍCEPS
  {
    exerciseId: '18', // Rosca Direta
    localVideoPath: '/videos/exercises/bicep-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-curl.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Demonstração da Rosca Direta'
  },

  // TRÍCEPS
  {
    exerciseId: '21', // Tríceps Testa
    localVideoPath: '/videos/exercises/skull-crusher.mp4',
    fallbackVideoPath: '/videos/exercises/generic-tricep.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=nALyRHQP4qE',
    description: 'Demonstração do Tríceps Testa'
  },

  // ABDÔMEN
  {
    exerciseId: '24', // Abdominal Reto
    localVideoPath: '/videos/exercises/crunch.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    description: 'Demonstração do Abdominal Reto'
  },
  {
    exerciseId: '25', // Prancha
    localVideoPath: '/videos/exercises/plank.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=TvxNkmjdhMM',
    description: 'Demonstração da Prancha'
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