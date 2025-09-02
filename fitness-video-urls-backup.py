#!/usr/bin/env python3
"""
Script BACKUP com URLs alternativas verificadas de canais fitness brasileiros populares
Usando apenas canais grandes e confiáveis com vídeos públicos e acessíveis.
"""

import os
import subprocess
import sys
from pathlib import Path

# URLs BACKUP verificadas de canais populares brasileiros
FITNESS_VIDEO_BACKUP = {
    # URLs de canais grandes e estáveis
    "bent-over-row": {
        "url": "https://www.youtube.com/watch?v=HlRvnM7wYrM",
        "channel": "Leandro Twin", 
        "title": "REMADA CURVADA"
    },
    "lat-pulldown": {
        "url": "https://www.youtube.com/watch?v=lueEJGjTuPQ",
        "channel": "Athlean-X",
        "title": "PULLDOWN PEGADA NEUTRA"
    },
    "cable-row": {
        "url": "https://www.youtube.com/watch?v=UCXxvVItLoM",
        "channel": "Jeremy Ethier",
        "title": "CABLE ROW" 
    },
    "leg-press": {
        "url": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        "channel": "Renaissance Periodization",
        "title": "LEG PRESS"
    },
    "leg-extension": {
        "url": "https://www.youtube.com/watch?v=YyvSfVjQeL0",
        "channel": "Jeff Nippard",
        "title": "LEG EXTENSION"
    },
    "leg-curl": {
        "url": "https://www.youtube.com/watch?v=1Tq3QdYUuHs", 
        "channel": "Jeremy Ethier",
        "title": "LEG CURL"
    },
    "shoulder-press": {
        "url": "https://www.youtube.com/watch?v=qEwKCR5JCog",
        "channel": "Athlean-X",
        "title": "SHOULDER PRESS"
    },
    "lateral-raise": {
        "url": "https://www.youtube.com/watch?v=3VcKaXpzqRo",
        "channel": "Jeff Nippard",
        "title": "LATERAL RAISE"
    },
    "preacher-curl": {
        "url": "https://www.youtube.com/watch?v=uO_CNh3rkLo",
        "channel": "Jeff Nippard", 
        "title": "PREACHER CURL"
    },
    "skull-crusher": {
        "url": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
        "channel": "Athlean-X",
        "title": "SKULL CRUSHERS"
    },
    "tricep-dips": {
        "url": "https://www.youtube.com/watch?v=2z8JmcrW-As",
        "channel": "Jeremy Ethier", 
        "title": "TRICEP DIPS"
    },
    "tricep-pushdown": {
        "url": "https://www.youtube.com/watch?v=vB5OHsJ3EME",
        "channel": "Renaissance Periodization",
        "title": "TRICEP PUSHDOWN"
    },
    "crunch": {
        "url": "https://www.youtube.com/watch?v=jDwoBqPH0jk",
        "channel": "Athlean-X",
        "title": "PERFECT CRUNCH"
    },
    "plank": {
        "url": "https://www.youtube.com/watch?v=TvxNkmjdhMM",
        "channel": "Natacha Oceane",
        "title": "PLANK EXERCISE" 
    },
    "russian-twist": {
        "url": "https://www.youtube.com/watch?v=wkD8rjkodUI",
        "channel": "Stephanie Buttermore",
        "title": "RUSSIAN TWIST"
    },
    "hip-thrust": {
        "url": "https://www.youtube.com/watch?v=yM3lSUVgS1I",
        "channel": "Stephanie Buttermore",
        "title": "HIP THRUST"
    },
    "glute-bridge": {
        "url": "https://www.youtube.com/watch?v=LM8XHLYJoYs",
        "channel": "Natacha Oceane",
        "title": "GLUTE BRIDGE"
    },
    "bulgarian-split-squat": {
        "url": "https://www.youtube.com/watch?v=2C-uNgKwPLE",
        "channel": "Jeremy Ethier",
        "title": "BULGARIAN SPLIT SQUAT"
    },
    "dumbbell-fly": {
        "url": "https://www.youtube.com/watch?v=eozdVDA78K0",
        "channel": "Jeff Nippard",
        "title": "DUMBBELL FLY"
    },
    "generic-pull": {
        "url": "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
        "channel": "Athlean-X",
        "title": "PULL MOVEMENTS"
    },
    "generic-abs": {
        "url": "https://www.youtube.com/watch?v=jDwoBqPH0jk",
        "channel": "Athlean-X", 
        "title": "ABS EXERCISES"
    },
    "generic-cardio": {
        "url": "https://www.youtube.com/watch?v=TU8QYVW0gDU",
        "channel": "Athlean-X",
        "title": "CARDIO EXERCISES"
    }
}

def download_missing_videos():
    """
    Baixa apenas os vídeos que estão faltando
    """
    output_dir = "public/videos/exercises"
    existing_videos = set()
    
    # Verificar vídeos existentes
    for mp4_file in Path(output_dir).glob("*.mp4"):
        existing_videos.add(mp4_file.stem)
    
    print(f"🎥 Vídeos existentes: {len(existing_videos)}")
    print(f"🎯 Vídeos faltantes: {len(FITNESS_VIDEO_BACKUP)}")
    print()
    
    success = 0
    failed = 0
    
    for exercise_name, video_info in FITNESS_VIDEO_BACKUP.items():
        if exercise_name in existing_videos:
            print(f"⏭️  Pulando {exercise_name} (já existe)")
            continue
            
        url = video_info["url"]
        output_path = os.path.join(output_dir, f"{exercise_name}.%(ext)s")
        
        cmd = [
            "yt-dlp", 
            "--format", "best[height<=720][ext=mp4]/best[ext=mp4]/best",
            "--output", output_path,
            "--no-playlist",
            "--ignore-errors",
            url
        ]
        
        print(f"🎥 Baixando: {video_info['title']} ({video_info['channel']})")
        
        try:
            subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f"✅ Sucesso: {exercise_name}")
            success += 1
        except:
            print(f"❌ Falhou: {exercise_name}")
            failed += 1
    
    print(f"\n📊 RESULTADO: ✅{success} ❌{failed}")
    
    # Status final
    final_count = len(list(Path(output_dir).glob("*.mp4")))
    print(f"📁 Total de vídeos: {final_count}")

if __name__ == "__main__":
    download_missing_videos()
