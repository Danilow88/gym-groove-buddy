# 🎥 Sistema de Vídeos dos Exercícios - Gym Groove Buddy

## 📋 Visão Geral

O Gym Groove Buddy agora possui um sistema completo de vídeos para exercícios, com suporte offline e fallbacks inteligentes. O sistema prioriza vídeos locais para funcionamento sem internet, mas mantém compatibilidade com vídeos online do YouTube.

## 🚀 Funcionalidades Principais

### ✅ Funcionalidades Implementadas:
- **Reprodução Offline**: Vídeos locais funcionam sem conexão com internet
- **Sistema de Fallback**: Múltiplos níveis de fallback automático
- **Indicadores Visuais**: Ícones mostram status online/offline dos vídeos
- **Tratamento de Erros**: Interface amigável para vídeos indisponíveis
- **Múltiplos Formatos**: Suporte a MP4, WebM, OGV
- **Carregamento Inteligente**: Preview e otimizações de performance
- **Vídeos Genéricos**: Sistema de categorização por grupo muscular

### 🎯 Interface do Usuário:
- **Botão Play**: Cada exercício com vídeo disponível tem botão de reprodução
- **Modal Responsivo**: Reprodutor em modal com controles completos
- **Status Offline**: Indicador visual para vídeos disponíveis offline
- **Retry System**: Botão "Tentar novamente" para vídeos com erro

## 📁 Estrutura de Arquivos

```
src/
├── data/
│   └── exercise-videos.ts          # Mapeamento de vídeos por exercício
├── hooks/
│   └── use-exercise-videos.ts      # Hook para gerenciamento de vídeos
├── components/workout/
│   └── video-modal.tsx             # Modal de reprodução de vídeos
└── pages/
    └── Workout.tsx                 # Página principal com funcionalidade

public/videos/exercises/
├── bench-press.mp4                 # Vídeos específicos
├── squat.mp4
├── pushup.mp4
└── generic/
    ├── generic-push.mp4            # Vídeos de fallback
    ├── generic-pull.mp4
    └── generic-squat.mp4
```

## 🔧 Como Funciona

### 1. Sistema de Prioridades
```typescript
// Ordem de prioridade para busca de vídeos:
1. Vídeo específico local (/videos/exercises/exercise-name.mp4)
2. Vídeo genérico local (/videos/exercises/generic-[category].mp4)
3. Vídeo do YouTube (fallback online)
4. Vídeo genérico universal
```

### 2. Mapeamento de Exercícios
Cada exercício é mapeado em `src/data/exercise-videos.ts`:

```typescript
{
  exerciseId: '1', // Supino Reto
  localVideoPath: '/videos/exercises/bench-press.mp4',
  fallbackVideoPath: '/videos/exercises/generic-push.mp4',
  youtubeUrl: 'https://www.youtube.com/watch?v=esQi683XR44',
  description: 'Demonstração do Supino Reto - técnica correta'
}
```

### 3. Hook de Gerenciamento
O `useExerciseVideos` hook fornece:

```typescript
const {
  getVideoInfo,           // Obtém informações completas do vídeo
  getVideoUrlWithFallback, // URL com fallback automático
  hasVideoAvailable,      // Verifica disponibilidade
  getPlayerType          // Determina tipo de player (local/youtube)
} = useExerciseVideos();
```

## 🎬 Adicionando Novos Vídeos

### Opção 1: Vídeos Locais (Recomendado para Offline)

1. **Salve o vídeo** em `public/videos/exercises/[exercise-name].mp4`
2. **Atualize o mapeamento** em `src/data/exercise-videos.ts`:

```typescript
{
  exerciseId: 'new-exercise-id',
  localVideoPath: '/videos/exercises/new-exercise.mp4',
  fallbackVideoPath: '/videos/exercises/generic-category.mp4',
  description: 'Descrição do exercício'
}
```

3. **Teste no app** - o vídeo deve aparecer automaticamente

### Opção 2: Gerando Vídeos de Demonstração

Use o `create-demo-videos.html`:

1. Abra o arquivo no navegador
2. Selecione um exercício
3. Clique em "Gerar Vídeo"
4. Baixe e renomeie conforme necessário

### Opção 3: Vídeos do YouTube (Fallback)

```typescript
{
  exerciseId: 'exercise-id',
  youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID',
  description: 'Demonstração online'
}
```

### Opção 4: Baixar do YouTube

```bash
# Instalar youtube-dl
pip install youtube-dl

# Baixar vídeo específico
youtube-dl -f "best[height<=720]" "URL_DO_VIDEO" -o "exercise-name.%(ext)s"

# Converter para MP4 se necessário
ffmpeg -i input-video.webm -c:v libx264 -c:a aac exercise-name.mp4
```

## 🔍 Como Usar no App

### Para Usuários:
1. **Visualize exercícios** na página de Treino
2. **Clique no botão Play** (▶️) em qualquer exercício
3. **Assista ao vídeo** no modal que abre
4. **Verifique o status** - ícone WiFi indica se é online/offline

### Para Desenvolvedores:
```typescript
// Importar o modal em qualquer componente
import { VideoModal } from "@/components/workout/video-modal";

// Usar no JSX
<VideoModal
  isOpen={showVideo}
  onClose={() => setShowVideo(false)}
  exerciseName="Nome do Exercício"
  exerciseId="exercise-id"
  muscleGroup="Peito"
/>
```

## 🎨 Customização

### Estilos do Player
O modal usa classes Tailwind e pode ser customizado em `video-modal.tsx`:

```typescript
// Classes principais:
className="bg-spotify-card border-border max-w-lg mx-auto"  // Modal
className="aspect-video bg-spotify-darker rounded-lg"        // Player area
className="text-spotify-green"                              // Status offline
```

### Vídeos Genéricos
Para adicionar nova categoria de vídeos genéricos:

```typescript
// Em src/data/exercise-videos.ts
export function getGenericVideoByMuscleGroup(muscleGroup: string): string {
  const genericVideos: Record<string, string> = {
    'NovoGrupo': '/videos/exercises/generic-novo-grupo.mp4',
    // ...
  };
  return genericVideos[muscleGroup] || '/videos/exercises/generic-workout.mp4';
}
```

## 🐛 Resolução de Problemas

### Vídeo não carrega:
1. ✅ Verifique se o arquivo existe em `public/videos/exercises/`
2. ✅ Confirme o mapeamento em `exercise-videos.ts`
3. ✅ Teste o vídeo diretamente no navegador
4. ✅ Verifique console do navegador para erros

### Vídeo muito lento:
1. ✅ Reduza resolução para 720p ou 480p
2. ✅ Comprima o arquivo (target: < 5MB)
3. ✅ Use formato MP4 H.264

### Sem conexão de internet:
1. ✅ Sistema automaticamente usa vídeos locais
2. ✅ Fallback para vídeos genéricos se específico não disponível
3. ✅ Indicador visual mostra status offline

## 📊 Performance

### Otimizações Implementadas:
- **Lazy Loading**: Vídeos carregam apenas quando necessário
- **Cache System**: URLs de vídeo são cacheadas em memória
- **Preload Metadata**: Apenas metadados são pré-carregados
- **Error Recovery**: Sistema de retry automático
- **Compression Ready**: Suporte a vídeos comprimidos

### Recomendações de Arquivo:
- **Resolução**: 720p (1280x720) ou 480p (854x480)
- **Duração**: 15-30 segundos por exercício
- **Formato**: MP4 H.264 + AAC
- **Bitrate**: 1-2 Mbps para 720p, 500kbps-1Mbps para 480p
- **Tamanho**: < 5MB por vídeo

## 🚀 Deploy e Distribuição

### Para Build de Produção:
1. ✅ Todos os vídeos são incluídos no build
2. ✅ Paths relativos funcionam automaticamente
3. ✅ Fallbacks garantem funcionamento mesmo sem vídeos locais

### Para PWA/Offline:
1. ✅ Vídeos locais funcionam completamente offline
2. ✅ Service Worker pode cachear vídeos específicos
3. ✅ Indicadores visuais mostram capacidade offline

---

## ✨ Próximos Passos Sugeridos

1. **Adicionar mais vídeos**: Cobrir todos os 72 exercícios mapeados
2. **Implementar PWA caching**: Cache automático de vídeos mais usados
3. **Analytics de vídeo**: Tracking de vídeos mais assistidos
4. **Playlist mode**: Reprodução em sequência para rotinas
5. **Slow-motion controls**: Controles de velocidade para estudar técnica

O sistema está completo e funcional! 🎉
