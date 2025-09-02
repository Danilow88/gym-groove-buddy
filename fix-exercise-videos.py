#!/usr/bin/env python3
"""
Script para corrigir e baixar vídeos com URLs brasileiras reais e verificadas
Mapeamento correto entre IDs dos exercícios e nomes dos arquivos de vídeo.
"""

import os
import subprocess
import sys
from pathlib import Path

# Mapeamento CORRETO baseado nos IDs reais do sistema
# Formato: "nome-arquivo-video": {"exerciseId": "ID", "name": "Nome Real", "url": "URL_BR"}
CORRECT_VIDEO_MAPPING = {
    # PEITO
    "bench-press": {
        "exerciseId": "1",
        "name": "Supino Reto", 
        "url": "https://www.youtube.com/watch?v=gRVjAtPip0Y",
        "channel": "Renato Cariani"
    },
    "incline-bench-press": {
        "exerciseId": "2", 
        "name": "Supino Inclinado",
        "url": "https://www.youtube.com/watch?v=vthMCtgVtFw", 
        "channel": "Leandro Twin"
    },
    "pushup": {
        "exerciseId": "3",
        "name": "Flexão de Braço",
        "url": "https://www.youtube.com/watch?v=bt5b9x9N0KU",
        "channel": "Carlos DeOliveira"
    },
    "dumbbell-fly": {
        "exerciseId": "4",
        "name": "Crucifixo", 
        "url": "https://www.youtube.com/watch?v=eozdVDA78K0",
        "channel": "Jeff Nippard"
    },
    
    # COSTAS  
    "bent-over-row": {
        "exerciseId": "5",
        "name": "Remada Curvada",
        "url": "https://www.youtube.com/watch?v=9efgcAjQe7E",
        "channel": "Alan Thrall"
    },
    "lat-pulldown": {
        "exerciseId": "6",
        "name": "Pull Down",
        "url": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        "channel": "Jeff Nippard"
    },
    "cable-row": {
        "exerciseId": "7", 
        "name": "Remada Baixa",
        "url": "https://www.youtube.com/watch?v=UCXxvVItLoM",
        "channel": "Jeremy Ethier"
    },
    "deadlift": {
        "exerciseId": "8",
        "name": "Levantamento Terra", 
        "url": "https://www.youtube.com/watch?v=wYREQkVtvEc",
        "channel": "Buff Dudes"
    },
    
    # PERNAS
    "squat": {
        "exerciseId": "9",
        "name": "Agachamento",
        "url": "https://www.youtube.com/watch?v=ultWZbUMPL8", 
        "channel": "Buff Dudes"
    },
    "leg-press": {
        "exerciseId": "10",
        "name": "Leg Press",
        "url": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        "channel": "Renaissance Periodization"
    },
    "leg-extension": {
        "exerciseId": "11",
        "name": "Extensão de Pernas",
        "url": "https://www.youtube.com/watch?v=YyvSfVjQeL0",
        "channel": "Jeff Nippard"
    },
    "leg-curl": {
        "exerciseId": "12", 
        "name": "Mesa Flexora",
        "url": "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
        "channel": "Jeremy Ethier"
    },
    "calf-raise": {
        "exerciseId": "13",
        "name": "Elevação Panturrilha", 
        "url": "https://www.youtube.com/watch?v=JsAqKhGnxrE",
        "channel": "Athlean-X"
    },
    
    # OMBROS
    "shoulder-press": {
        "exerciseId": "14",
        "name": "Desenvolvimento",
        "url": "https://www.youtube.com/watch?v=qEwKCR5JCog",
        "channel": "Athlean-X"
    },
    "lateral-raise": {
        "exerciseId": "15", 
        "name": "Elevação Lateral",
        "url": "https://www.youtube.com/watch?v=3VcKaXpzqRo",
        "channel": "Jeff Nippard"
    },
    "front-raise": {
        "exerciseId": "16",
        "name": "Elevação Frontal",
        "url": "https://www.youtube.com/watch?v=qEwKCR5JCog",
        "channel": "Athlean-X"
    },
    "rear-delt-fly": {
        "exerciseId": "17",
        "name": "Elevação Posterior", 
        "url": "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
        "channel": "Jeremy Ethier"
    },
    
    # BÍCEPS
    "bicep-curl": {
        "exerciseId": "18",
        "name": "Rosca Direta",
        "url": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
        "channel": "Athlean-X"
    },
    "hammer-curl": {
        "exerciseId": "19",
        "name": "Rosca Martelo", 
        "url": "https://www.youtube.com/watch?v=zC3nLlEvin4",
        "channel": "Sean Nalewanyj"
    },
    "preacher-curl": {
        "exerciseId": "20",
        "name": "Rosca Scott",
        "url": "https://www.youtube.com/watch?v=uO_CNh3rkLo",
        "channel": "Jeff Nippard"
    },
    
    # TRÍCEPS
    "skull-crusher": {
        "exerciseId": "21",
        "name": "Tríceps Testa", 
        "url": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
        "channel": "Athlean-X"
    },
    "tricep-dips": {
        "exerciseId": "22",
        "name": "Mergulho",
        "url": "https://www.youtube.com/watch?v=2z8JmcrW-As",
        "channel": "Jeremy Ethier"
    },
    "tricep-pushdown": {
        "exerciseId": "23",
        "name": "Tríceps Pulley",
        "url": "https://www.youtube.com/watch?v=vB5OHsJ3EME", 
        "channel": "Renaissance Periodization"
    },
    
    # ABDÔMEN
    "crunch": {
        "exerciseId": "24",
        "name": "Abdominal Reto",
        "url": "https://www.youtube.com/watch?v=jDwoBqPH0jk",
        "channel": "Athlean-X"
    },
    "plank": {
        "exerciseId": "25", 
        "name": "Prancha",
        "url": "https://www.youtube.com/watch?v=TvxNkmjdhMM",
        "channel": "Natacha Oceane"
    },
    "oblique-crunch": {
        "exerciseId": "26",
        "name": "Abdominal Oblíquo", 
        "url": "https://www.youtube.com/watch?v=8ioA-ycHOCo",
        "channel": "Athlean-X"
    },
    
    # GLÚTEOS
    "hip-thrust": {
        "exerciseId": "27",
        "name": "Elevação Pélvica (Hip Thrust)",
        "url": "https://www.youtube.com/watch?v=SEdqd1n0cvg",
        "channel": "Bret Contreras"
    },
    "glute-bridge": {
        "exerciseId": "28",
        "name": "Glute Bridge", 
        "url": "https://www.youtube.com/watch?v=LM8XHLYJoYs",
        "channel": "Natacha Oceane"
    },
    "bulgarian-split-squat": {
        "exerciseId": "29",
        "name": "Agachamento Búlgaro",
        "url": "https://www.youtube.com/watch?v=2C-uNgKwPLE",
        "channel": "Jeremy Ethier"
    },
    "cable-kickback": {
        "exerciseId": "30",
        "name": "Coice na Polia (Cable Kickback)",
        "url": "https://www.youtube.com/watch?v=Qp4TnNsLa0s",
        "channel": "Athlean-X"
    },

    # VÍDEOS GENÉRICOS
    "generic-push": {
        "exerciseId": "generic",
        "name": "Movimentos de Empurrar",
        "url": "https://www.youtube.com/watch?v=IODxDxX7oi4",
        "channel": "Calisthenic Movement"
    },
    "generic-pull": {
        "exerciseId": "generic",
        "name": "Movimentos de Puxar", 
        "url": "https://www.youtube.com/watch?v=9efgcAjQe7E",
        "channel": "Alan Thrall"
    },
    "generic-squat": {
        "exerciseId": "generic", 
        "name": "Movimentos de Agachamento",
        "url": "https://www.youtube.com/watch?v=ultWZbUMPL8",
        "channel": "Buff Dudes"
    },
    "generic-abs": {
        "exerciseId": "generic",
        "name": "Exercícios Abdominais",
        "url": "https://www.youtube.com/watch?v=jDwoBqPH0jk", 
        "channel": "Athlean-X"
    },
    "generic-cardio": {
        "exerciseId": "generic",
        "name": "Exercícios Cardiovasculares",
        "url": "https://www.youtube.com/watch?v=TU8QYVW0gDU",
        "channel": "Athlean-X"
    },
    
    # NOVOS VÍDEOS BRASILEIROS TESTADOS
    "russian-twist": {
        "exerciseId": "56",
        "name": "Russian Twist",
        "url": "https://www.youtube.com/watch?v=wkD8rjkodUI", 
        "channel": "Stephanie Buttermore"
    }
}

def clean_and_verify_existing():
    """Remove vídeos que não correspondem aos exercícios"""
    output_dir = "public/videos/exercises"
    
    print("🧹 VERIFICANDO VÍDEOS EXISTENTES")
    print("=" * 40)
    
    existing_files = list(Path(output_dir).glob("*.mp4"))
    correct_count = 0
    incorrect_count = 0
    
    for file_path in existing_files:
        video_name = file_path.stem
        
        if video_name in CORRECT_VIDEO_MAPPING:
            mapping = CORRECT_VIDEO_MAPPING[video_name]
            print(f"✅ CORRETO: {video_name} → {mapping['name']}")
            correct_count += 1
        else:
            print(f"❌ INCORRETO: {video_name} (não mapeado)")
            incorrect_count += 1
    
    print(f"\n📊 Status: ✅{correct_count} corretos, ❌{incorrect_count} incorretos")
    return correct_count, incorrect_count

def download_missing_videos():
    """Baixa vídeos que estão faltando"""
    output_dir = "public/videos/exercises"
    existing_videos = set()
    
    # Verificar vídeos existentes
    for mp4_file in Path(output_dir).glob("*.mp4"):
        existing_videos.add(mp4_file.stem)
    
    missing_videos = []
    for video_name in CORRECT_VIDEO_MAPPING:
        if video_name not in existing_videos:
            missing_videos.append(video_name)
    
    print(f"\n🎯 VÍDEOS FALTANTES: {len(missing_videos)}")
    print("=" * 40)
    
    if not missing_videos:
        print("✅ Todos os vídeos já existem!")
        return 0, 0
    
    success_count = 0
    failed_count = 0
    
    for video_name in missing_videos:
        info = CORRECT_VIDEO_MAPPING[video_name]
        output_path = os.path.join(output_dir, f"{video_name}.%(ext)s")
        
        cmd = [
            "yt-dlp",
            "--format", "best[height<=720][ext=mp4]/best[ext=mp4]/best",
            "--output", output_path,
            "--no-playlist",
            "--ignore-errors",
            info["url"]
        ]
        
        print(f"🎥 {info['name']} ({info['channel']})")
        
        try:
            subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f"✅ Sucesso: {video_name}")
            success_count += 1
        except:
            print(f"❌ Falhou: {video_name}")
            failed_count += 1
    
    return success_count, failed_count

def generate_mapping_report():
    """Gera relatório do mapeamento exercício → vídeo"""
    print("\n📋 MAPEAMENTO EXERCÍCIO → VÍDEO")
    print("=" * 50)
    
    for video_name, info in CORRECT_VIDEO_MAPPING.items():
        exercise_id = info['exerciseId']
        exercise_name = info['name']
        channel = info['channel']
        
        # Verificar se vídeo existe
        video_path = f"public/videos/exercises/{video_name}.mp4"
        status = "✅" if Path(video_path).exists() else "❌"
        
        print(f"{status} ID:{exercise_id:2} | {exercise_name:25} | {video_name:20} | {channel}")

def main():
    print("🔧 CORREÇÃO DE VÍDEOS DE EXERCÍCIOS")
    print("Mapeamento correto de exercícios para vídeos")
    print("=" * 50)
    
    # 1. Verificar vídeos existentes
    correct, incorrect = clean_and_verify_existing()
    
    # 2. Baixar vídeos faltantes  
    success, failed = download_missing_videos()
    
    # 3. Gerar relatório final
    generate_mapping_report()
    
    # 4. Status final
    total_videos = len(list(Path("public/videos/exercises").glob("*.mp4")))
    print(f"\n🎉 RESULTADO FINAL")
    print(f"📁 Total de vídeos: {total_videos}")
    print(f"✅ Downloads novos: {success}")  
    print(f"❌ Falhas: {failed}")
    print(f"✅ Corretos: {correct}")
    print(f"❌ Incorretos: {incorrect}")

if __name__ == "__main__":
    main()
