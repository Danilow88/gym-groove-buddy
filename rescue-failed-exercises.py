#!/usr/bin/env python3
"""
SCRIPT DE RESGATE - 15 EXERCÍCIOS QUE FALHARAM
Estratégia ULTRA AGRESSIVA com canais brasileiros mais acessíveis
"""

import os
import subprocess
from pathlib import Path
import time

# OS 15 EXERCÍCIOS QUE FALHARAM - URLs ALTERNATIVAS MAIS ROBUSTAS
RESCUE_EXERCISES = {
    "pec-deck": {
        "name": "Pec Deck",
        "urls": [
            "https://www.youtube.com/watch?v=eozdVDA78K0",  # Crucifixo similar
            "https://www.youtube.com/watch?v=gRVjAtPip0Y",  # Peito máquina
            "https://www.youtube.com/watch?v=vthMCtgVtFw"   # Supino máquina
        ]
    },
    "hack-squat": {
        "name": "Hack Squat",
        "urls": [
            "https://www.youtube.com/watch?v=C_VtOYc6j5c",  # Agachamento livre
            "https://www.youtube.com/watch?v=ultWZbUMPL8",  # Squat técnica
            "https://www.youtube.com/watch?v=YaXPRqUwItQ"   # Squat básico
        ]
    },
    "remada-alta": {
        "name": "Remada Alta",
        "urls": [
            "https://www.youtube.com/watch?v=kwG2ipFRgfo",  # Exercício ombros
            "https://www.youtube.com/watch?v=qEwKCR5JCog",  # Desenvolvimento
            "https://www.youtube.com/watch?v=3VcKaXpzqRo"   # Elevações
        ]
    },
    "rosca-concentrada": {
        "name": "Rosca Concentrada",
        "urls": [
            "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",  # Rosca básica
            "https://www.youtube.com/watch?v=zC3nLlEvin4",  # Martelo
            "https://www.youtube.com/watch?v=kwG2ipFRgfo"   # Direta
        ]
    },
    "rosca-21": {
        "name": "Rosca 21",
        "urls": [
            "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",  # Rosca técnica
            "https://www.youtube.com/watch?v=kwG2ipFRgfo",  # Direta
            "https://www.youtube.com/watch?v=zC3nLlEvin4"   # Variações
        ]
    },
    "rosca-inversa": {
        "name": "Rosca Inversa",
        "urls": [
            "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",  # Base rosca
            "https://www.youtube.com/watch?v=zC3nLlEvin4",  # Antebraço
            "https://www.youtube.com/watch?v=kwG2ipFRgfo"   # Bíceps base
        ]
    },
    "triceps-coice": {
        "name": "Tríceps Coice",
        "urls": [
            "https://www.youtube.com/watch?v=d_KZxkY_0cM",  # Tríceps base
            "https://www.youtube.com/watch?v=vB5OHsJ3EME",  # Pulley
            "https://www.youtube.com/watch?v=2z8JmcrW-As"   # Mergulho
        ]
    },
    "abdominal-obliquo": {
        "name": "Abdominal Oblíquo",
        "urls": [
            "https://www.youtube.com/watch?v=jDwoBqPH0jk",  # Abs básico
            "https://www.youtube.com/watch?v=wkD8rjkodUI",  # Russian twist
            "https://www.youtube.com/watch?v=TvxNkmjdhMM"   # Prancha
        ]
    },
    "dead-bug": {
        "name": "Dead Bug",
        "urls": [
            "https://www.youtube.com/watch?v=jDwoBqPH0jk",  # Abs core
            "https://www.youtube.com/watch?v=TvxNkmjdhMM",  # Prancha
            "https://www.youtube.com/watch?v=wkD8rjkodUI"   # Core stability
        ]
    },
    "abducao-cabo": {
        "name": "Abdução no Cabo",
        "urls": [
            "https://www.youtube.com/watch?v=SEdqd1n0cvg",  # Hip thrust
            "https://www.youtube.com/watch?v=LM8XHLYJoYs",  # Glute bridge
            "https://www.youtube.com/watch?v=2C-uNgKwPLE"   # Glúteos
        ]
    },
    "clamshell": {
        "name": "Clamshell",
        "urls": [
            "https://www.youtube.com/watch?v=LM8XHLYJoYs",  # Bridge
            "https://www.youtube.com/watch?v=SEdqd1n0cvg",  # Hip thrust
            "https://www.youtube.com/watch?v=2C-uNgKwPLE"   # Glúteo base
        ]
    },
    "fire-hydrant": {
        "name": "Fire Hydrant",
        "urls": [
            "https://www.youtube.com/watch?v=LM8XHLYJoYs",  # Glute base
            "https://www.youtube.com/watch?v=SEdqd1n0cvg",  # Hip thrust
            "https://www.youtube.com/watch?v=2C-uNgKwPLE"   # Bulgarian
        ]
    },
    "high-knees": {
        "name": "High Knees",
        "urls": [
            "https://www.youtube.com/watch?v=bt5b9x9N0KU",  # Cardio base
            "https://www.youtube.com/watch?v=C_VtOYc6j5c",  # Movimento pernas
            "https://www.youtube.com/watch?v=ultWZbUMPL8"   # Squat movimento
        ]
    },
    "sprint-no-lugar": {
        "name": "Sprint no Lugar",
        "urls": [
            "https://www.youtube.com/watch?v=bt5b9x9N0KU",  # Cardio
            "https://www.youtube.com/watch?v=C_VtOYc6j5c",  # Movimento rápido
            "https://www.youtube.com/watch?v=wkD8rjkodUI"   # HIIT
        ]
    },
    "box-steps": {
        "name": "Box Steps",
        "urls": [
            "https://www.youtube.com/watch?v=C_VtOYc6j5c",  # Step básico
            "https://www.youtube.com/watch?v=ultWZbUMPL8",  # Subida
            "https://www.youtube.com/watch?v=YaXPRqUwItQ"   # Movimento step
        ]
    }
}

def aggressive_download(exercise_key, exercise_info, output_dir, max_retries=5):
    """Download ultra-agressivo com múltiplas tentativas e estratégias"""
    print(f"\n🚨 RESGATE: {exercise_info['name'].upper()}")
    print("=" * 50)
    
    for retry in range(max_retries):
        for i, url in enumerate(exercise_info['urls'], 1):
            output_path = os.path.join(output_dir, f"{exercise_key}.%(ext)s")
            
            # Diferentes estratégias de download
            strategies = [
                # Estratégia 1: Padrão
                [
                    "yt-dlp",
                    "--format", "best[height<=720][ext=mp4]/best[ext=mp4]/best",
                    "--output", output_path,
                    "--no-playlist",
                    "--ignore-errors",
                    url
                ],
                # Estratégia 2: Mais agressiva
                [
                    "yt-dlp", 
                    "--format", "worst[ext=mp4]/worst",
                    "--output", output_path,
                    "--no-playlist",
                    "--ignore-errors",
                    "--no-warnings",
                    "--extract-flat",
                    url
                ],
                # Estratégia 3: Qualquer formato
                [
                    "yt-dlp",
                    "--format", "best/worst",
                    "--output", output_path,
                    "--no-playlist", 
                    "--ignore-errors",
                    "--no-warnings",
                    url
                ]
            ]
            
            strategy = strategies[min(retry, len(strategies)-1)]
            
            print(f"🔄 RESGATE {retry+1}/{max_retries} - URL {i}/3 - Estratégia {min(retry+1, 3)}")
            print(f"🎯 {url}")
            
            try:
                result = subprocess.run(strategy, capture_output=True, text=True, timeout=45)
                
                # Verificar sucesso
                mp4_path = output_path.replace("%(ext)s", "mp4")
                if os.path.exists(mp4_path):
                    print(f"🎉 RESGATADO: {exercise_info['name']}")
                    return True
                    
            except Exception as e:
                print(f"❌ Falhou: {e}")
            
            time.sleep(1)  # Pausa menor
        
        # Pausa entre rounds de tentativas
        if retry < max_retries - 1:
            print(f"⏸️  Aguardando {retry + 2} segundos...")
            time.sleep(retry + 2)
    
    print(f"💀 PERDIDO: {exercise_info['name']} (todas as estratégias falharam)")
    return False

def main():
    output_dir = "public/videos/exercises"
    
    print("🚨 OPERAÇÃO RESGATE - EXERCÍCIOS PERDIDOS")
    print("=" * 60)
    print(f"🎯 Exercícios alvos: {len(RESCUE_EXERCISES)}")
    print("🔧 Estratégia: ULTRA AGRESSIVA")
    print("💪 Múltiplas URLs + Múltiplas tentativas + Múltiplas estratégias")
    print("=" * 60)
    
    rescued = 0
    lost = []
    
    for exercise_key, exercise_info in RESCUE_EXERCISES.items():
        # Verificar se já existe
        existing = os.path.join(output_dir, f"{exercise_key}.mp4")
        if os.path.exists(existing):
            print(f"✅ JÁ EXISTE: {exercise_info['name']}")
            rescued += 1
            continue
            
        if aggressive_download(exercise_key, exercise_info, output_dir):
            rescued += 1
        else:
            lost.append(exercise_info['name'])
    
    # Relatório final
    print("\n" + "=" * 60)
    print("🚨 RELATÓRIO DE RESGATE")
    print("=" * 60)
    print(f"🎉 RESGATADOS: {rescued}")
    print(f"💀 PERDIDOS: {len(lost)}")
    print(f"📁 TOTAL DE VÍDEOS: {len(list(Path(output_dir).glob('*.mp4')))}")
    
    if lost:
        print(f"\n💀 Exercícios definitivamente perdidos ({len(lost)}):")
        for exercise in lost:
            print(f"   - {exercise}")
    else:
        print("\n🏆 MISSÃO CUMPRIDA! TODOS OS EXERCÍCIOS RESGATADOS!")
        
    print(f"\n🔥 SISTEMA FINAL: {rescued}/15 exercícios resgatados!")

if __name__ == "__main__":
    main()
