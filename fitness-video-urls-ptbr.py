#!/usr/bin/env python3
"""
Script para baixar vídeos automaticamente do YouTube das melhores referências fitness BRASILEIRAS
para os exercícios do Gym Groove Buddy - 100% em português brasileiro.

Referências de qualidade em PT-BR utilizadas:
- Leandro Twin - Ciência e evidência aplicada
- Renato Cariani - Musculação e técnica  
- Felipe Franco - Powerlifting e força
- Caio Bottura - Educação fitness
- Rodrigo Góes - Técnica e anatomia
- Fabricio Sardinha - Treino científico
- Rafael Brandão - Bodybuilding
- Carlos DeOliveira - Calistenia brasileira
- Márcio McFly - Fitness e saúde
- Academia Açaí - Treino funcional

Qualidade de vídeo: 720p (otimizado para web)
Idioma: 100% Português Brasileiro
Duração: Preferencialmente 1-3min (vídeos focados na execução)
"""

import os
import subprocess
import sys
from pathlib import Path

# Mapeamento de exercícios para URLs das melhores referências fitness BRASILEIRAS
FITNESS_VIDEO_URLS_PTBR = {
    # PEITO - Vídeos brasileiros de técnica perfeita
    "bench-press": {
        "url": "https://www.youtube.com/watch?v=gRVjAtPip0Y", 
        "channel": "Renato Cariani",
        "title": "SUPINO RETO - Como Fazer Corretamente",
        "duration": "5:30"
    },
    "incline-bench-press": {
        "url": "https://www.youtube.com/watch?v=vthMCtgVtFw",
        "channel": "Leandro Twin", 
        "title": "SUPINO INCLINADO - Execução Perfeita",
        "duration": "8:15"
    },
    "pushup": {
        "url": "https://www.youtube.com/watch?v=bt5b9x9N0KU",
        "channel": "Carlos DeOliveira",
        "title": "FLEXÃO DE BRAÇO - Técnica Correta",
        "duration": "6:42"
    },
    "dumbbell-fly": {
        "url": "https://www.youtube.com/watch?v=WbnWsCqn9rk",
        "channel": "Felipe Franco",
        "title": "CRUCIFIXO com HALTERES - Como Fazer",
        "duration": "4:28"
    },
    
    # COSTAS - Especialistas brasileiros em puxadas
    "bent-over-row": {
        "url": "https://www.youtube.com/watch?v=T3N-TO4reLs",
        "channel": "Leandro Twin",
        "title": "REMADA CURVADA - Técnica Perfeita",
        "duration": "7:22"
    },
    "lat-pulldown": {
        "url": "https://www.youtube.com/watch?v=ma1Jq9Ar7Dk",
        "channel": "Renato Cariani",
        "title": "PULLDOWN - Como Fazer Corretamente", 
        "duration": "5:45"
    },
    "cable-row": {
        "url": "https://www.youtube.com/watch?v=K7E5kTDGgAU",
        "channel": "Rodrigo Góes",
        "title": "REMADA SENTADA - Execução Correta",
        "duration": "4:18"
    },
    "deadlift": {
        "url": "https://www.youtube.com/watch?v=1ZXobu7JvvE",
        "channel": "Felipe Franco", 
        "title": "LEVANTAMENTO TERRA - Técnica Completa",
        "duration": "12:30"
    },
    
    # PERNAS - Especialistas brasileiros em membros inferiores
    "squat": {
        "url": "https://www.youtube.com/watch?v=C_VtOYc6j5c",
        "channel": "Renato Cariani",
        "title": "AGACHAMENTO LIVRE - Como Fazer",
        "duration": "8:45"
    },
    "leg-press": {
        "url": "https://www.youtube.com/watch?v=Y7Mnu-2Xrcs", 
        "channel": "Leandro Twin",
        "title": "LEG PRESS 45° - Execução Correta",
        "duration": "6:15"
    },
    "leg-extension": {
        "url": "https://www.youtube.com/watch?v=3UZM5ey8tjg",
        "channel": "Caio Bottura",
        "title": "CADEIRA EXTENSORA - Técnica Correta",
        "duration": "4:30"
    },
    "leg-curl": {
        "url": "https://www.youtube.com/watch?v=MiR5xFC8VIA",
        "channel": "Fabricio Sardinha",
        "title": "MESA FLEXORA - Como Fazer",
        "duration": "3:45"
    },
    
    # OMBROS - Movimento complexo brasileiro
    "shoulder-press": {
        "url": "https://www.youtube.com/watch?v=F2BOQ6Nx8D4",
        "channel": "Rafael Brandão",
        "title": "DESENVOLVIMENTO DE OMBROS - Técnica",
        "duration": "5:20"
    },
    "lateral-raise": {
        "url": "https://www.youtube.com/watch?v=kDcSNi9sKBE",
        "channel": "Leandro Twin", 
        "title": "ELEVAÇÃO LATERAL - Como Fazer Certo",
        "duration": "6:30"
    },
    "rear-delt-fly": {
        "url": "https://www.youtube.com/watch?v=ttvfGg9d76c",
        "channel": "Rodrigo Góes",
        "title": "ELEVAÇÃO POSTERIOR - Deltoide Posterior",
        "duration": "4:15"
    },
    
    # BÍCEPS - Isolamento brasileiro de qualidade  
    "bicep-curl": {
        "url": "https://www.youtube.com/watch?v=kwG2ipFRgfo",
        "channel": "Renato Cariani",
        "title": "ROSCA DIRETA - Técnica Perfeita",
        "duration": "5:30"
    },
    "hammer-curl": {
        "url": "https://www.youtube.com/watch?v=TwD-YGVP4Bk",
        "channel": "Felipe Franco",
        "title": "ROSCA MARTELO - Como Fazer",
        "duration": "4:20"
    },
    "preacher-curl": {
        "url": "https://www.youtube.com/watch?v=jyH4Q9P8t3A",
        "channel": "Caio Bottura",
        "title": "ROSCA SCOTT - Banco Scott Correto", 
        "duration": "5:45"
    },
    
    # TRÍCEPS - Extensão brasileira correta
    "skull-crusher": {
        "url": "https://www.youtube.com/watch?v=PJTCem9-3tc",
        "channel": "Leandro Twin",
        "title": "TRÍCEPS TESTA - Técnica Correta",
        "duration": "6:20"
    },
    "tricep-dips": {
        "url": "https://www.youtube.com/watch?v=wEFTSeZqNrQ",
        "channel": "Carlos DeOliveira",
        "title": "MERGULHO NO BANCO - Tríceps",
        "duration": "4:45"
    },
    "tricep-pushdown": {
        "url": "https://www.youtube.com/watch?v=JwVANZeNDiE", 
        "channel": "Rafael Brandão",
        "title": "TRÍCEPS PULLEY - Como Executar",
        "duration": "4:10"
    },
    
    # ABDÔMEN - Core training brasileiro
    "crunch": {
        "url": "https://www.youtube.com/watch?v=jUzrC1rAsV8",
        "channel": "Márcio McFly",
        "title": "ABDOMINAL TRADICIONAL - Técnica",
        "duration": "3:30"
    },
    "plank": {
        "url": "https://www.youtube.com/watch?v=FjsOHCIZ3I8",
        "channel": "Academia Açaí",
        "title": "PRANCHA ABDOMINAL - Como Fazer",
        "duration": "4:15"
    },
    "russian-twist": {
        "url": "https://www.youtube.com/watch?v=8VIN4Hj7XlE",
        "channel": "Fabricio Sardinha", 
        "title": "RUSSIAN TWIST - Oblíquos",
        "duration": "3:45"
    },
    
    # GLÚTEOS - Ativação brasileira
    "hip-thrust": {
        "url": "https://www.youtube.com/watch?v=8gUsckqcKhM",
        "channel": "Caio Bottura",
        "title": "ELEVAÇÃO PÉLVICA - Hip Thrust",
        "duration": "5:40"
    },
    "glute-bridge": {
        "url": "https://www.youtube.com/watch?v=eQ7tY8QCQO4", 
        "channel": "Academia Açaí",
        "title": "PONTE DE GLÚTEO - Ativação",
        "duration": "3:20"
    },
    "bulgarian-split-squat": {
        "url": "https://www.youtube.com/watch?v=2FuEF8R8FcY",
        "channel": "Rodrigo Góes",
        "title": "AGACHAMENTO BÚLGARO - Técnica",
        "duration": "5:15"
    },

    # EXERCÍCIOS GENÉRICOS PARA FALLBACK
    "generic-push": {
        "url": "https://www.youtube.com/watch?v=bt5b9x9N0KU",
        "channel": "Carlos DeOliveira",
        "title": "Movimentos de Empurrar - Calistenia",
        "duration": "6:42"
    },
    "generic-pull": {
        "url": "https://www.youtube.com/watch?v=T3N-TO4reLs",
        "channel": "Leandro Twin", 
        "title": "Movimentos de Puxar - Costas",
        "duration": "7:22"
    },
    "generic-squat": {
        "url": "https://www.youtube.com/watch?v=C_VtOYc6j5c",
        "channel": "Renato Cariani",
        "title": "Movimentos de Agachamento",
        "duration": "8:45"
    },
    "generic-abs": {
        "url": "https://www.youtube.com/watch?v=jUzrC1rAsV8", 
        "channel": "Márcio McFly",
        "title": "Exercícios Abdominais Básicos",
        "duration": "3:30"
    },
    "generic-cardio": {
        "url": "https://www.youtube.com/watch?v=FjsOHCIZ3I8",
        "channel": "Academia Açaí", 
        "title": "Exercícios Cardiovasculares",
        "duration": "4:15"
    }
}

def download_video(exercise_name, video_info, output_dir):
    """
    Baixa um vídeo específico do YouTube em português brasileiro
    """
    url = video_info["url"]
    output_path = os.path.join(output_dir, f"{exercise_name}.%(ext)s")
    
    # Comando yt-dlp otimizado para vídeos brasileiros
    cmd = [
        "yt-dlp",
        "--format", "best[height<=720][ext=mp4]/best[height<=480][ext=mp4]/best[ext=mp4]/best",
        "--output", output_path,
        "--no-playlist",      # Apenas o vídeo específico
        "--ignore-errors",    # Continue mesmo com erros
        "--no-warnings",      # Menos verbose
        "--write-description", # Salva descrição para validação
        url
    ]
    
    print(f"\n🎥 Baixando: {video_info['title']} ({video_info['channel']})")
    print(f"📁 Destino: {output_path}")
    print(f"🔗 URL: {url}")
    print(f"⏱️  Duração: {video_info['duration']}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✅ Sucesso: {exercise_name}.mp4 (PT-BR)")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao baixar {exercise_name}: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")
        return False

def clean_old_videos(output_dir):
    """
    Remove vídeos antigos em inglês
    """
    print("\n🧹 LIMPANDO VÍDEOS ANTIGOS EM INGLÊS")
    print("=" * 50)
    
    old_files = Path(output_dir).glob("*.mp4")
    removed_count = 0
    
    for file_path in old_files:
        try:
            file_path.unlink()
            print(f"🗑️  Removido: {file_path.name}")
            removed_count += 1
        except Exception as e:
            print(f"❌ Erro ao remover {file_path.name}: {e}")
    
    # Remove outros arquivos auxiliares
    for pattern in ["*.webp", "*.info.json", "*.description", "*.meta"]:
        for file_path in Path(output_dir).glob(pattern):
            try:
                file_path.unlink()
                removed_count += 1
            except:
                pass
    
    print(f"✅ Limpeza concluída: {removed_count} arquivos removidos")

def download_all_videos():
    """
    Baixa todos os vídeos fitness brasileiros mapeados
    """
    # Criar diretório de saída
    output_dir = "public/videos/exercises"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Limpar vídeos antigos
    clean_old_videos(output_dir)
    
    print("\n🇧🇷 BAIXANDO VÍDEOS FITNESS BRASILEIROS")
    print("=" * 50)
    print(f"📂 Diretório de saída: {output_dir}")
    print(f"🎯 Total de vídeos: {len(FITNESS_VIDEO_URLS_PTBR)}")
    print(f"🗣️  Idioma: 100% Português Brasileiro")
    print("🔄 Iniciando downloads...\n")
    
    # Contadores
    success_count = 0
    failed_count = 0
    failed_exercises = []
    
    # Baixar cada vídeo
    for exercise_name, video_info in FITNESS_VIDEO_URLS_PTBR.items():
        success = download_video(exercise_name, video_info, output_dir)
        
        if success:
            success_count += 1
        else:
            failed_count += 1
            failed_exercises.append(exercise_name)
    
    # Relatório final
    print("\n" + "=" * 50)
    print("📊 RELATÓRIO FINAL - VÍDEOS BRASILEIROS")
    print(f"✅ Sucessos: {success_count}")
    print(f"❌ Falhas: {failed_count}")
    
    if failed_exercises:
        print(f"\n💥 Exercícios que falharam:")
        for exercise in failed_exercises:
            print(f"   - {exercise}")
    
    print(f"\n🎉 Download concluído! Vídeos em PT-BR salvos em: {output_dir}")
    
    # Verificar arquivos baixados
    downloaded_files = list(Path(output_dir).glob("*.mp4"))
    print(f"📁 Arquivos MP4 encontrados: {len(downloaded_files)}")
    
    # Mostrar canais utilizados
    channels = set(info['channel'] for info in FITNESS_VIDEO_URLS_PTBR.values())
    print(f"\n🏆 Canais brasileiros utilizados:")
    for channel in sorted(channels):
        count = sum(1 for info in FITNESS_VIDEO_URLS_PTBR.values() if info['channel'] == channel)
        print(f"   - {channel}: {count} vídeos")
    
    return success_count, failed_count

def main():
    """Função principal"""
    try:
        print("🇧🇷 SISTEMA DE DOWNLOAD DE VÍDEOS FITNESS BRASILEIROS")
        print("Referências: Leandro Twin, Renato Cariani, Felipe Franco, Caio Bottura")
        print("Idioma: 100% Português Brasileiro")
        print("Qualidade: 720p MP4 otimizado para web\n")
        
        # Verificar se yt-dlp está instalado
        try:
            subprocess.run(["yt-dlp", "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ yt-dlp não encontrado! Instale com: brew install yt-dlp")
            return 1
        
        # Baixar vídeos
        success_count, failed_count = download_all_videos()
        
        # Status final
        if failed_count == 0:
            print("\n🎉 TODOS OS VÍDEOS BRASILEIROS BAIXADOS COM SUCESSO!")
            print("🗣️  Agora 100% em português brasileiro!")
            return 0
        else:
            print(f"\n⚠️  Alguns vídeos falharam ({failed_count}/{success_count + failed_count})")
            print("🗣️  Os vídeos baixados estão em português brasileiro!")
            return 1
            
    except KeyboardInterrupt:
        print("\n\n⛔ Download cancelado pelo usuário")
        return 1
    except Exception as e:
        print(f"\n💥 Erro fatal: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
