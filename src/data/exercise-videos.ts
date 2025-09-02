// Mapeamento de exercícios para vídeos - ATUALIZADO COM VÍDEOS BRASILEIROS
// Prioriza vídeos em português brasileiro (PT-BR) 

export interface ExerciseVideo {
  exerciseId: string;
  localVideoPath?: string;
  fallbackVideoPath?: string;
  youtubeUrl?: string;
  description: string;
}

export const exerciseVideos: ExerciseVideo[] = [
  {
    exerciseId: '1', // Bench Press
    localVideoPath: '/videos/exercises/bench-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Bench Press'
  },
  {
    exerciseId: '2', // Incline Bench Press
    localVideoPath: '/videos/exercises/incline-bench-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Incline Bench Press'
  },
  {
    exerciseId: '31', // Supino Declinado
    localVideoPath: '/videos/exercises/supino-declinado.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Supino Declinado'
  },
  {
    exerciseId: '4', // Pushup
    localVideoPath: '/videos/exercises/pushup.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Pushup'
  },
  {
    exerciseId: '5', // Flexao Diamante
    localVideoPath: '/videos/exercises/flexao-diamante.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Flexao Diamante'
  },
  {
    exerciseId: '6', // Dumbbell Fly
    localVideoPath: '/videos/exercises/dumbbell-fly.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Dumbbell Fly'
  },
  {
    exerciseId: '7', // Crossover
    localVideoPath: '/videos/exercises/crossover.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Crossover'
  },
  {
    exerciseId: '8', // Pec Deck
    localVideoPath: '/videos/exercises/pec-deck.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Pec Deck'
  },
  {
    exerciseId: '32', // Flexao Fechada
    localVideoPath: '/videos/exercises/flexao-fechada.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Flexao Fechada'
  },
  {
    exerciseId: '9', // Bent Over Row
    localVideoPath: '/videos/exercises/bent-over-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Bent Over Row'
  },
  {
    exerciseId: '10', // Cable Row
    localVideoPath: '/videos/exercises/cable-row.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Cable Row'
  },
  {
    exerciseId: '11', // Lat Pulldown
    localVideoPath: '/videos/exercises/lat-pulldown.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Lat Pulldown'
  },
  {
    exerciseId: '12', // Barra Fixa
    localVideoPath: '/videos/exercises/barra-fixa.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Barra Fixa'
  },
  {
    exerciseId: '13', // Remada Unilateral
    localVideoPath: '/videos/exercises/remada-unilateral.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Remada Unilateral'
  },
  {
    exerciseId: '15', // Pegada Neutra
    localVideoPath: '/videos/exercises/pegada-neutra.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Pegada Neutra'
  },
  {
    exerciseId: '16', // Pulley Alto
    localVideoPath: '/videos/exercises/pulley-alto.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Pulley Alto'
  },
  {
    exerciseId: '17', // Deadlift
    localVideoPath: '/videos/exercises/deadlift.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Deadlift'
  },
  {
    exerciseId: '18', // Squat
    localVideoPath: '/videos/exercises/squat.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Squat'
  },
  {
    exerciseId: '19', // Leg Press
    localVideoPath: '/videos/exercises/leg-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Leg Press'
  },
  {
    exerciseId: '20', // Leg Extension
    localVideoPath: '/videos/exercises/leg-extension.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Leg Extension'
  },
  {
    exerciseId: '21', // Leg Curl
    localVideoPath: '/videos/exercises/leg-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Leg Curl'
  },
  {
    exerciseId: '23', // Stiff
    localVideoPath: '/videos/exercises/stiff.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Stiff'
  },
  {
    exerciseId: '24', // Agachamento Frontal
    localVideoPath: '/videos/exercises/agachamento-frontal.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Agachamento Frontal'
  },
  {
    exerciseId: '25', // Afundo
    localVideoPath: '/videos/exercises/afundo.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Afundo'
  },
  {
    exerciseId: '26', // Hack Squat
    localVideoPath: '/videos/exercises/hack-squat.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Hack Squat'
  },
  {
    exerciseId: '27', // Passada
    localVideoPath: '/videos/exercises/passada.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Passada'
  },
  {
    exerciseId: '29', // Bulgarian Split Squat
    localVideoPath: '/videos/exercises/bulgarian-split-squat.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Bulgarian Split Squat'
  },
  {
    exerciseId: '33', // Shoulder Press
    localVideoPath: '/videos/exercises/shoulder-press.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Shoulder Press'
  },
  {
    exerciseId: '34', // Front Raise
    localVideoPath: '/videos/exercises/front-raise.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Front Raise'
  },
  {
    exerciseId: '35', // Lateral Raise
    localVideoPath: '/videos/exercises/lateral-raise.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Lateral Raise'
  },
  {
    exerciseId: '36', // Rear Delt Fly
    localVideoPath: '/videos/exercises/rear-delt-fly.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Rear Delt Fly'
  },
  {
    exerciseId: '37', // Desenvolvimento Arnold
    localVideoPath: '/videos/exercises/desenvolvimento-arnold.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Desenvolvimento Arnold'
  },
  {
    exerciseId: '38', // Remada Alta
    localVideoPath: '/videos/exercises/remada-alta.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Remada Alta'
  },
  {
    exerciseId: '39', // Face Pull
    localVideoPath: '/videos/exercises/face-pull.mp4',
    fallbackVideoPath: '/videos/exercises/generic-pull.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Face Pull'
  },
  {
    exerciseId: '40', // Encolhimento
    localVideoPath: '/videos/exercises/encolhimento.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Encolhimento'
  },
  {
    exerciseId: '41', // Bicep Curl
    localVideoPath: '/videos/exercises/bicep-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Bicep Curl'
  },
  {
    exerciseId: '42', // Hammer Curl
    localVideoPath: '/videos/exercises/hammer-curl.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Hammer Curl'
  },
  {
    exerciseId: '44', // Rosca Concentrada
    localVideoPath: '/videos/exercises/rosca-concentrada.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Rosca Concentrada'
  },
  {
    exerciseId: '45', // Rosca 21
    localVideoPath: '/videos/exercises/rosca-21.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Rosca 21'
  },
  {
    exerciseId: '46', // Rosca No Cabo
    localVideoPath: '/videos/exercises/rosca-no-cabo.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Rosca No Cabo'
  },
  {
    exerciseId: '47', // Rosca Inversa
    localVideoPath: '/videos/exercises/rosca-inversa.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Rosca Inversa'
  },
  {
    exerciseId: '48', // Tricep Dips
    localVideoPath: '/videos/exercises/tricep-dips.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Tricep Dips'
  },
  {
    exerciseId: '49', // Tricep Pushdown
    localVideoPath: '/videos/exercises/tricep-pushdown.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Tricep Pushdown'
  },
  {
    exerciseId: '50', // Triceps Frances
    localVideoPath: '/videos/exercises/triceps-frances.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Triceps Frances'
  },
  {
    exerciseId: '51', // Skull Crusher
    localVideoPath: '/videos/exercises/skull-crusher.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Skull Crusher'
  },
  {
    exerciseId: '52', // Triceps Coice
    localVideoPath: '/videos/exercises/triceps-coice.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Triceps Coice'
  },
  {
    exerciseId: '53', // Triceps Corda
    localVideoPath: '/videos/exercises/triceps-corda.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Triceps Corda'
  },
  {
    exerciseId: '54', // Crunch
    localVideoPath: '/videos/exercises/crunch.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Crunch'
  },
  {
    exerciseId: '55', // Plank
    localVideoPath: '/videos/exercises/plank.mp4',
    fallbackVideoPath: '/videos/exercises/generic-abs.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Plank'
  },
  {
    exerciseId: '56', // Abdominal Obliquo
    localVideoPath: '/videos/exercises/abdominal-obliquo.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Abdominal Obliquo'
  },
  {
    exerciseId: '57', // Russian Twist
    localVideoPath: '/videos/exercises/russian-twist.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Russian Twist'
  },
  {
    exerciseId: '58', // Mountain Climber
    localVideoPath: '/videos/exercises/mountain-climber.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Mountain Climber'
  },
  {
    exerciseId: '59', // Dead Bug
    localVideoPath: '/videos/exercises/dead-bug.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Dead Bug'
  },
  {
    exerciseId: '60', // Elevacao Pernas
    localVideoPath: '/videos/exercises/elevacao-pernas.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Elevacao Pernas'
  },
  {
    exerciseId: '61', // Bicicleta
    localVideoPath: '/videos/exercises/bicicleta.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Bicicleta'
  },
  {
    exerciseId: '62', // Hip Thrust
    localVideoPath: '/videos/exercises/hip-thrust.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Hip Thrust'
  },
  {
    exerciseId: '63', // Glute Bridge
    localVideoPath: '/videos/exercises/glute-bridge.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Glute Bridge'
  },
  {
    exerciseId: '65', // Abducao Cabo
    localVideoPath: '/videos/exercises/abducao-cabo.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Abducao Cabo'
  },
  {
    exerciseId: '66', // Clamshell
    localVideoPath: '/videos/exercises/clamshell.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Clamshell'
  },
  {
    exerciseId: '67', // Single Leg Glute Bridge
    localVideoPath: '/videos/exercises/single-leg-glute-bridge.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Single Leg Glute Bridge'
  },
  {
    exerciseId: '68', // Fire Hydrant
    localVideoPath: '/videos/exercises/fire-hydrant.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Fire Hydrant'
  },
  {
    exerciseId: '69', // Jumping Jacks
    localVideoPath: '/videos/exercises/jumping-jacks.mp4',
    fallbackVideoPath: '/videos/exercises/generic-cardio.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Jumping Jacks'
  },
  {
    exerciseId: '70', // High Knees
    localVideoPath: '/videos/exercises/high-knees.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - High Knees'
  },
  {
    exerciseId: '71', // Polichinelos
    localVideoPath: '/videos/exercises/polichinelos.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Polichinelos'
  },
  {
    exerciseId: '72', // Sprint No Lugar
    localVideoPath: '/videos/exercises/sprint-no-lugar.mp4',
    fallbackVideoPath: '/videos/exercises/generic-cardio.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Sprint No Lugar'
  },
  {
    exerciseId: '73', // Box Steps
    localVideoPath: '/videos/exercises/box-steps.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Box Steps'
  },
  {
    exerciseId: '74', // Corda Simulacao
    localVideoPath: '/videos/exercises/corda-simulacao.mp4',
    fallbackVideoPath: '/videos/exercises/generic-push.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Corda Simulacao'
  },
  {
    exerciseId: '75', // Squat Jump
    localVideoPath: '/videos/exercises/squat-jump.mp4',
    fallbackVideoPath: '/videos/exercises/generic-squat.mp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=bt5b9x9N0KU',
    description: 'Demonstração em português brasileiro - Squat Jump'
  },

];

// Funções auxiliares do sistema de vídeos
export function getExerciseVideo(exerciseId: string): ExerciseVideo | undefined {
  return exerciseVideos.find(video => video.exerciseId === exerciseId);
}

export function getVideoUrl(exerciseId: string): string | undefined {
  const video = getExerciseVideo(exerciseId);
  return video?.localVideoPath || video?.youtubeUrl;
}

export function isLocalVideo(videoUrl: string): boolean {
  return videoUrl.startsWith('/videos/') || videoUrl.startsWith('./videos/');
}

export function getGenericVideoByMuscleGroup(muscleGroup: string): string {
  const genericVideos: Record<string, string> = {
    'Peito': '/videos/exercises/generic-push.mp4',
    'Costas': '/videos/exercises/generic-pull.mp4', 
    'Pernas': '/videos/exercises/generic-squat.mp4',
    'Ombros': '/videos/exercises/generic-push.mp4',
    'Bíceps': '/videos/exercises/generic-pull.mp4',
    'Tríceps': '/videos/exercises/generic-push.mp4',
    'Abdômen': '/videos/exercises/generic-abs.mp4',
    'Glúteo': '/videos/exercises/generic-squat.mp4',
    'Cardio': '/videos/exercises/generic-cardio.mp4'
  };
  
  return genericVideos[muscleGroup] || '/videos/exercises/generic-push.mp4';
}

// Sistema prioriza vídeos locais brasileiros
// Fallback para vídeos genéricos se necessário
// Todos os vídeos são em português brasileiro (PT-BR)
