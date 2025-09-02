#!/usr/bin/env python3
"""
Script para eliminar as últimas duplicações do generic-cardio
Vou mapear o "Coice na Polia" para um vídeo mais apropriado
"""

import re

def fix_final_duplicates():
    """Corrige as últimas duplicações do generic-cardio"""
    
    with open("src/data/exercise-videos.ts", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Mapear "Coice na Polia" para um vídeo mais apropriado
    # Como é um exercício de glúteo, vou usar o glute-bridge
    content = re.sub(
        r"(exerciseId: '30'.*?Coice na Polia.*?)'/videos/exercises/generic-cardio\.mp4'",
        r"\1'/videos/exercises/glute-bridge.mp4'",
        content,
        flags=re.DOTALL
    )
    
    # Mapear fallback também
    content = re.sub(
        r"(exerciseId: '30'.*?Coice na Polia.*?fallbackVideoPath: )'/videos/exercises/generic-cardio\.mp4'",
        r"\1'/videos/exercises/hip-thrust.mp4'",
        content,
        flags=re.DOTALL
    )
    
    # Melhorar o mapeamento do getGenericVideoByMuscleGroup para glúteos
    content = re.sub(
        r"'Glúteos': '/videos/exercises/glute-bridge\.mp4'",
        r"'Glúteos': '/videos/exercises/hip-thrust.mp4'",
        content
    )
    
    with open("src/data/exercise-videos.ts", "w", encoding="utf-8") as f:
        f.write(content)
    
    print("✅ Duplicações finais eliminadas!")
    print("✅ Coice na Polia → glute-bridge.mp4")
    print("✅ Fallback Glúteos → hip-thrust.mp4")

def verify_no_duplicates():
    """Verifica se não há mais duplicações"""
    
    with open("src/data/exercise-videos.ts", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extrair todos os localVideoPath
    video_paths = re.findall(r"localVideoPath: '([^']+)'", content)
    
    # Verificar duplicações
    duplicates = set([v for v in video_paths if video_paths.count(v) > 1])
    
    print(f"\n🔍 VERIFICAÇÃO DE DUPLICAÇÕES:")
    print(f"📁 Total de vídeos mapeados: {len(video_paths)}")
    print(f"🎯 Vídeos únicos: {len(set(video_paths))}")
    
    if duplicates:
        print(f"❌ Duplicações encontradas: {duplicates}")
        for dup in duplicates:
            count = video_paths.count(dup)
            print(f"   {dup}: usado {count} vezes")
    else:
        print("🎉 ZERO DUPLICAÇÕES! Mapeamento perfeito!")
    
    return len(duplicates) == 0

def main():
    print("🔧 ELIMINAÇÃO FINAL DE DUPLICAÇÕES")
    print("=" * 40)
    
    fix_final_duplicates()
    is_perfect = verify_no_duplicates()
    
    if is_perfect:
        print("\n🏆 MAPEAMENTO 100% PERFEITO ALCANÇADO!")
        print("✅ Cada exercício tem seu vídeo único")
        print("✅ Zero duplicações")
        print("✅ Máxima precisão")
    else:
        print("\n⚠️  Ainda há problemas. Verificando...")

if __name__ == "__main__":
    main()
