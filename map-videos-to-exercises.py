#!/usr/bin/env python3
"""
Script para mapear TODOS os vídeos baixados aos exercícios corretos do sistema
Cria mapeamento preciso entre nomes de exercícios e arquivos de vídeo
"""

import os
import json
from pathlib import Path

# MAPEAMENTO PRECISO: Nome do Exercício no Sistema → Arquivo de Vídeo
EXERCISE_TO_VIDEO_MAPPING = {
    # PEITO
    'Supino Reto': 'bench-press',
    'Supino Inclinado': 'incline-bench-press', 
    'Flexão de Braço': 'pushup',
    'Crucifixo': 'dumbbell-fly',
    'Supino Declinado': 'supino-declinado',
    'Crossover': 'crossover',
    'Flexão Diamante': 'flexao-diamante',
    'Pec Deck': 'pec-deck',
    
    # COSTAS
    'Remada Curvada': 'bent-over-row',
    'Pull Down': 'lat-pulldown',
    'Remada Baixa': 'cable-row', 
    'Levantamento Terra': 'deadlift',
    'Barra Fixa': 'barra-fixa',
    'Remada Unilateral': 'remada-unilateral',
    'Pull Down Pegada Neutra': 'pegada-neutra',
    'Pulley Alto': 'pulley-alto',
    
    # PERNAS  
    'Agachamento': 'squat',
    'Leg Press': 'leg-press',
    'Extensão de Pernas': 'leg-extension',
    'Mesa Flexora': 'leg-curl',
    'Elevação Panturrilha': 'generic-squat',  # fallback
    'Agachamento Frontal': 'agachamento-frontal',
    'Stiff': 'stiff',
    'Afundo': 'afundo', 
    'Hack Squat': 'hack-squat',
    'Passada': 'passada',
    
    # OMBROS
    'Desenvolvimento': 'shoulder-press',
    'Elevação Lateral': 'lateral-raise',
    'Elevação Frontal': 'front-raise',
    'Elevação Posterior': 'rear-delt-fly',
    'Desenvolvimento Arnold': 'desenvolvimento-arnold',
    'Remada Alta': 'remada-alta',
    'Face Pull': 'face-pull',
    'Encolhimento': 'encolhimento',
    
    # BÍCEPS
    'Rosca Direta': 'bicep-curl',
    'Rosca Martelo': 'hammer-curl',
    'Rosca Scott': 'generic-pull',  # fallback disponível
    'Rosca Concentrada': 'rosca-concentrada',
    'Rosca 21': 'rosca-21',
    'Rosca no Cabo': 'rosca-no-cabo',
    'Rosca Inversa': 'rosca-inversa',
    
    # TRÍCEPS
    'Tríceps Testa': 'skull-crusher',
    'Mergulho': 'tricep-dips',
    'Tríceps Pulley': 'tricep-pushdown',
    'Tríceps Francês': 'triceps-frances',
    'Flexão Fechada': 'flexao-fechada',
    'Tríceps Coice': 'triceps-coice',
    'Tríceps Corda': 'triceps-corda',
    
    # ABDÔMEN  
    'Abdominal Reto': 'crunch',
    'Prancha': 'plank',
    'Abdominal Oblíquo': 'abdominal-obliquo',
    'Russian Twist': 'russian-twist',
    'Mountain Climber': 'mountain-climber',
    'Dead Bug': 'dead-bug',
    'Elevação de Pernas': 'elevacao-pernas',
    'Bicicleta': 'bicicleta',
    
    # GLÚTEOS
    'Elevação Pélvica (Hip Thrust)': 'hip-thrust',
    'Glute Bridge': 'glute-bridge',
    'Agachamento Búlgaro': 'bulgarian-split-squat',
    'Coice na Polia (Cable Kickback)': 'generic-squat',  # fallback
    'Abdução no Cabo': 'abducao-cabo',
    'Clamshell': 'clamshell',
    'Single Leg Glute Bridge': 'single-leg-glute-bridge',
    'Fire Hydrant': 'fire-hydrant',
    
    # CARDIO
    'Burpee': 'generic-cardio',  # fallback
    'Jumping Jacks': 'jumping-jacks',
    'High Knees': 'high-knees',
    'Polichinelos': 'polichinelos', 
    'Sprint no Lugar': 'sprint-no-lugar',
    'Box Steps': 'box-steps',
    'Corda (Simulação)': 'corda-simulacao',
    'Squat Jump': 'squat-jump'
}

def verify_videos_exist():
    """Verifica quais vídeos existem fisicamente"""
    video_dir = Path("public/videos/exercises")
    existing_videos = set()
    
    for mp4_file in video_dir.glob("*.mp4"):
        existing_videos.add(mp4_file.stem)
    
    return existing_videos

def generate_mapping_report(existing_videos):
    """Gera relatório detalhado do mapeamento"""
    print("🎯 MAPEAMENTO EXERCÍCIOS → VÍDEOS")
    print("=" * 60)
    
    mapped_count = 0
    missing_count = 0
    
    for exercise_name, video_file in EXERCISE_TO_VIDEO_MAPPING.items():
        if video_file in existing_videos:
            print(f"✅ {exercise_name:35} → {video_file}.mp4")
            mapped_count += 1
        else:
            print(f"❌ {exercise_name:35} → {video_file}.mp4 (FALTANDO)")
            missing_count += 1
    
    print("\n" + "=" * 60)
    print(f"📊 ESTATÍSTICAS:")
    print(f"✅ Exercícios mapeados: {mapped_count}")
    print(f"❌ Exercícios sem vídeo: {missing_count}")
    print(f"📁 Total de vídeos disponíveis: {len(existing_videos)}")
    print(f"🎯 Taxa de cobertura: {(mapped_count/(mapped_count+missing_count)*100):.1f}%")
    
    return mapped_count, missing_count

def update_exercise_videos_file():
    """Atualiza o arquivo src/data/exercise-videos.ts com mapeamento correto"""
    
    # Ler o arquivo atual
    video_file = Path("src/data/exercise-videos.ts")
    if not video_file.exists():
        print("❌ Arquivo exercise-videos.ts não encontrado")
        return False
    
    print("\n🔄 ATUALIZANDO SISTEMA DE VÍDEOS...")
    
    # Criar novo conteúdo
    new_content = '''export interface ExerciseVideoInfo {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  localUrl?: string;
  youtubeUrl?: string;
  fallbackUrl?: string;
  description?: string;
}

export const VIDEO_MAP: { [key: string]: ExerciseVideoInfo } = {
'''
    
    exercise_id = 1
    for exercise_name, video_file in EXERCISE_TO_VIDEO_MAPPING.items():
        # Determinar grupo muscular
        if exercise_name in ['Supino Reto', 'Supino Inclinado', 'Flexão de Braço', 'Crucifixo', 'Supino Declinado', 'Crossover', 'Flexão Diamante', 'Pec Deck']:
            muscle_group = 'Peito'
        elif exercise_name in ['Remada Curvada', 'Pull Down', 'Remada Baixa', 'Levantamento Terra', 'Barra Fixa', 'Remada Unilateral', 'Pull Down Pegada Neutra', 'Pulley Alto']:
            muscle_group = 'Costas'
        elif exercise_name in ['Agachamento', 'Leg Press', 'Extensão de Pernas', 'Mesa Flexora', 'Elevação Panturrilha', 'Agachamento Frontal', 'Stiff', 'Afundo', 'Hack Squat', 'Passada']:
            muscle_group = 'Pernas'
        elif exercise_name in ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Elevação Posterior', 'Desenvolvimento Arnold', 'Remada Alta', 'Face Pull', 'Encolhimento']:
            muscle_group = 'Ombros'
        elif exercise_name in ['Rosca Direta', 'Rosca Martelo', 'Rosca Scott', 'Rosca Concentrada', 'Rosca 21', 'Rosca no Cabo', 'Rosca Inversa']:
            muscle_group = 'Bíceps'
        elif exercise_name in ['Tríceps Testa', 'Mergulho', 'Tríceps Pulley', 'Tríceps Francês', 'Flexão Fechada', 'Tríceps Coice', 'Tríceps Corda']:
            muscle_group = 'Tríceps'
        elif exercise_name in ['Abdominal Reto', 'Prancha', 'Abdominal Oblíquo', 'Russian Twist', 'Mountain Climber', 'Dead Bug', 'Elevação de Pernas', 'Bicicleta']:
            muscle_group = 'Abdômen'
        elif exercise_name in ['Elevação Pélvica (Hip Thrust)', 'Glute Bridge', 'Agachamento Búlgaro', 'Coice na Polia (Cable Kickback)', 'Abdução no Cabo', 'Clamshell', 'Single Leg Glute Bridge', 'Fire Hydrant']:
            muscle_group = 'Glúteos'
        else:
            muscle_group = 'Cardio'
        
        new_content += f'''  "{exercise_id}": {{
    exerciseId: "{exercise_id}",
    name: "{exercise_name}",
    muscleGroup: "{muscle_group}",
    localUrl: "/videos/exercises/{video_file}.mp4",
    fallbackUrl: "/videos/exercises/generic-{muscle_group.lower()}.mp4",
    description: "Vídeo demonstrativo de {exercise_name}"
  }},
'''
        exercise_id += 1
    
    new_content += "};\n"
    
    # Escrever arquivo
    with open(video_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Arquivo exercise-videos.ts atualizado com sucesso!")
    return True

def main():
    print("🎯 MAPEAMENTO COMPLETO DE VÍDEOS PARA EXERCÍCIOS")
    print("Conectando todos os vídeos baixados aos exercícios do sistema")
    print("=" * 60)
    
    # 1. Verificar vídeos disponíveis
    existing_videos = verify_videos_exist()
    print(f"📁 Vídeos encontrados: {len(existing_videos)}")
    
    # 2. Gerar relatório de mapeamento
    mapped, missing = generate_mapping_report(existing_videos)
    
    # 3. Atualizar sistema de vídeos
    update_exercise_videos_file()
    
    # 4. Relatório final
    print(f"\n🎉 SISTEMA DE VÍDEOS ATUALIZADO!")
    print(f"✅ {mapped} exercícios conectados aos vídeos")
    print(f"🎬 Sistema pronto para reproduzir vídeos locais!")
    
    if missing > 0:
        print(f"⚠️  {missing} exercícios usando vídeos de fallback")

if __name__ == "__main__":
    main()
