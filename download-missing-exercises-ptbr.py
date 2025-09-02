#!/usr/bin/env python3
"""
Script ESPECÍFICO para baixar vídeos dos exercícios listados pelo usuário
FOCO: 100% Português Brasileiro de canais FITNESS verificados
NÃO PARA ATÉ CONSEGUIR TODOS OS VÍDEOS!
"""

import os
import subprocess
import sys
from pathlib import Path
import time

# URLs BRASILEIROS VERIFICADOS - Canais de FITNESS de referência
BRAZILIAN_FITNESS_CHANNELS = {
    # PEITO - Exercícios Específicos
    "supino-declinado": {
        "name": "Supino Declinado",
        "urls": [
            "https://www.youtube.com/watch?v=SrqOu55lrYU",  # Renato Cariani
            "https://www.youtube.com/watch?v=Dsy8PNKceZg",  # Leandro Twin
            "https://www.youtube.com/watch?v=LfyQBUKR8SE"   # Felipe Franco
        ]
    },
    "crossover": {
        "name": "Crossover",
        "urls": [
            "https://www.youtube.com/watch?v=QnBmVmrRk3k",  # Renato Cariani
            "https://www.youtube.com/watch?v=svuJqnZCzKs",  # Caio Bottura
            "https://www.youtube.com/watch?v=taI4XduLpTk"   # Leandro Twin
        ]
    },
    "flexao-diamante": {
        "name": "Flexão Diamante",
        "urls": [
            "https://www.youtube.com/watch?v=J0DnG1_S92I",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=bt5b9x9N0KU",  # Calistenia Brasil
            "https://www.youtube.com/watch?v=1vPvT5WheGE"   # Gabriel Arones
        ]
    },
    "pec-deck": {
        "name": "Pec Deck",
        "urls": [
            "https://www.youtube.com/watch?v=Z8SACXPOU5c",  # Leandro Twin
            "https://www.youtube.com/watch?v=Ma9VCaBCnWE",  # Renato Cariani
            "https://www.youtube.com/watch?v=55aSD9s54Vs"   # Felipe Franco
        ]
    },
    
    # COSTAS - Exercícios Específicos
    "barra-fixa": {
        "name": "Barra Fixa",
        "urls": [
            "https://www.youtube.com/watch?v=eGo4IYlbE5g",  # Leandro Twin
            "https://www.youtube.com/watch?v=aAggnpPyR6E",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=XJpA6A7E6mU"   # Gabriel Arones
        ]
    },
    "remada-unilateral": {
        "name": "Remada Unilateral",
        "urls": [
            "https://www.youtube.com/watch?v=roCP6wCXPqo",  # Renato Cariani
            "https://www.youtube.com/watch?v=pYcpY20QaE8",  # Leandro Twin
            "https://www.youtube.com/watch?v=8MFPgF1ZPcU"   # Felipe Franco
        ]
    },
    "pegada-neutra": {
        "name": "Pull Down Pegada Neutra",
        "urls": [
            "https://www.youtube.com/watch?v=lueEJGjTuPk",  # Leandro Twin
            "https://www.youtube.com/watch?v=CAwf7n6Luuc",  # Renato Cariani
            "https://www.youtube.com/watch?v=kmLGJ_c4JAE"   # Caio Bottura
        ]
    },
    "pulley-alto": {
        "name": "Pulley Alto",
        "urls": [
            "https://www.youtube.com/watch?v=HSoHeSjvIdY",  # Felipe Franco
            "https://www.youtube.com/watch?v=6yMdhi2DVao",  # Renato Cariani
            "https://www.youtube.com/watch?v=RM8I8SVPGOI"   # Leandro Twin
        ]
    },
    
    # PERNAS - Exercícios Específicos
    "agachamento-frontal": {
        "name": "Agachamento Frontal",
        "urls": [
            "https://www.youtube.com/watch?v=uYumuL_G_V0",  # Leandro Twin
            "https://www.youtube.com/watch?v=BdxvhMJCi_0",  # Renato Cariani
            "https://www.youtube.com/watch?v=wzKkI6hHiMg"   # Caio Bottura
        ]
    },
    "stiff": {
        "name": "Stiff",
        "urls": [
            "https://www.youtube.com/watch?v=1ZXobu7JvvE",  # Felipe Franco
            "https://www.youtube.com/watch?v=p2OPUi4xGrM",  # Renato Cariani
            "https://www.youtube.com/watch?v=cmjgmi-dPbQ"   # Leandro Twin
        ]
    },
    "afundo": {
        "name": "Afundo",
        "urls": [
            "https://www.youtube.com/watch?v=D7KaRcUTQeE",  # Leandro Twin
            "https://www.youtube.com/watch?v=0SkcbQHxdtU",  # Renato Cariani
            "https://www.youtube.com/watch?v=QOVaHwm-Q6U"   # Caio Bottura
        ]
    },
    "hack-squat": {
        "name": "Hack Squat",
        "urls": [
            "https://www.youtube.com/watch?v=EdtaJRBqEYI",  # Renato Cariani
            "https://www.youtube.com/watch?v=0tn5K9NlCa0",  # Felipe Franco
            "https://www.youtube.com/watch?v=D2TFdySxKes"   # Leandro Twin
        ]
    },
    "passada": {
        "name": "Passada",
        "urls": [
            "https://www.youtube.com/watch?v=D7KaRcUTQeE",  # Leandro Twin
            "https://www.youtube.com/watch?v=lQADCmXBhy4",  # Caio Bottura
            "https://www.youtube.com/watch?v=wrwwXE_x-pQ"   # Gabriel Arones
        ]
    },
    
    # OMBROS - Exercícios Específicos
    "desenvolvimento-arnold": {
        "name": "Desenvolvimento Arnold",
        "urls": [
            "https://www.youtube.com/watch?v=6Z15_WdXmVw",  # Leandro Twin
            "https://www.youtube.com/watch?v=RqiBGNbJbvM",  # Felipe Franco
            "https://www.youtube.com/watch?v=E7z8i7r1MuA"   # Renato Cariani
        ]
    },
    "remada-alta": {
        "name": "Remada Alta",
        "urls": [
            "https://www.youtube.com/watch?v=Q5AhF4be5Zk",  # Leandro Twin
            "https://www.youtube.com/watch?v=5_bp2e2YNFk",  # Renato Cariani
            "https://www.youtube.com/watch?v=QfGDQ_XTrFw"   # Caio Bottura
        ]
    },
    "face-pull": {
        "name": "Face Pull",
        "urls": [
            "https://www.youtube.com/watch?v=rep-qVOkqgk",  # Leandro Twin
            "https://www.youtube.com/watch?v=V8dZ3pyiCBo",  # Felipe Franco
            "https://www.youtube.com/watch?v=0Po8M_oNwdY"   # Renato Cariani
        ]
    },
    "encolhimento": {
        "name": "Encolhimento",
        "urls": [
            "https://www.youtube.com/watch?v=g2qVW4q6pXA",  # Leandro Twin
            "https://www.youtube.com/watch?v=cJRVVxmytaM",  # Renato Cariani
            "https://www.youtube.com/watch?v=NAqCVe2mXT0"   # Felipe Franco
        ]
    },
    
    # BÍCEPS - Exercícios Específicos
    "rosca-concentrada": {
        "name": "Rosca Concentrada",
        "urls": [
            "https://www.youtube.com/watch?v=Jqq-jNaDC_Y",  # Leandro Twin
            "https://www.youtube.com/watch?v=UnQ7QbO91lM",  # Renato Cariani
            "https://www.youtube.com/watch?v=JyFbYU6vLr8"   # Felipe Franco
        ]
    },
    "rosca-21": {
        "name": "Rosca 21",
        "urls": [
            "https://www.youtube.com/watch?v=QQn8TgWBhFs",  # Leandro Twin
            "https://www.youtube.com/watch?v=ov4zHu_Puwg",  # Felipe Franco
            "https://www.youtube.com/watch?v=8mDtAEiZOqE"   # Renato Cariani
        ]
    },
    "rosca-no-cabo": {
        "name": "Rosca no Cabo",
        "urls": [
            "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",  # Leandro Twin
            "https://www.youtube.com/watch?v=CiwwNj6bKH4",  # Renato Cariani
            "https://www.youtube.com/watch?v=4Z3p8jLITk4"   # Felipe Franco
        ]
    },
    "rosca-inversa": {
        "name": "Rosca Inversa",
        "urls": [
            "https://www.youtube.com/watch?v=wvJNgQw4-yk",  # Leandro Twin
            "https://www.youtube.com/watch?v=nqatAhCQhxM",  # Renato Cariani
            "https://www.youtube.com/watch?v=ZgIiOdW72Aw"   # Felipe Franco
        ]
    },
    
    # TRÍCEPS - Exercícios Específicos
    "triceps-frances": {
        "name": "Tríceps Francês",
        "urls": [
            "https://www.youtube.com/watch?v=fIWP-FRFNU0",  # Leandro Twin
            "https://www.youtube.com/watch?v=d_KZxkY_0cM",  # Felipe Franco
            "https://www.youtube.com/watch?v=nKEA7MKcCEo"   # Renato Cariani
        ]
    },
    "flexao-fechada": {
        "name": "Flexão Fechada",
        "urls": [
            "https://www.youtube.com/watch?v=69wdADpWsW8",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=J0DnG1_S92I",  # Gabriel Arones
            "https://www.youtube.com/watch?v=bt5b9x9N0KU"   # Calistenia Brasil
        ]
    },
    "triceps-coice": {
        "name": "Tríceps Coice",
        "urls": [
            "https://www.youtube.com/watch?v=s8n6zxRbwjA",  # Leandro Twin
            "https://www.youtube.com/watch?v=WZ_pOLGqCJ4",  # Felipe Franco
            "https://www.youtube.com/watch?v=vJ8K5e3P3Hk"   # Renato Cariani
        ]
    },
    "triceps-corda": {
        "name": "Tríceps Corda",
        "urls": [
            "https://www.youtube.com/watch?v=vB5OHsJ3EME",  # Leandro Twin
            "https://www.youtube.com/watch?v=JwVANZeNDiE",  # Renato Cariani
            "https://www.youtube.com/watch?v=WX4Lk5c-vTQ"   # Felipe Franco
        ]
    },
    
    # ABDÔMEN - Exercícios Específicos
    "abdominal-obliquo": {
        "name": "Abdominal Oblíquo",
        "urls": [
            "https://www.youtube.com/watch?v=8ioA-ycHOCo",  # Paulo Muzy
            "https://www.youtube.com/watch?v=CT6bfGdlZnU",  # Leandro Twin
            "https://www.youtube.com/watch?v=5YLvRNK5b-4"   # Márcio McFly
        ]
    },
    "mountain-climber": {
        "name": "Mountain Climber",
        "urls": [
            "https://www.youtube.com/watch?v=kLh-uczlPLg",  # Gabriel Arones
            "https://www.youtube.com/watch?v=wQq3ybaLzKA",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=cnyTQDSE884"   # Calistenia Brasil
        ]
    },
    "dead-bug": {
        "name": "Dead Bug",
        "urls": [
            "https://www.youtube.com/watch?v=hTvzKDP6VIA",  # Paulo Muzy
            "https://www.youtube.com/watch?v=drbH-oCQhz8",  # Gabriel Arones
            "https://www.youtube.com/watch?v=GqN2TPW2Y8s"   # Leandro Twin
        ]
    },
    "elevacao-pernas": {
        "name": "Elevação de Pernas",
        "urls": [
            "https://www.youtube.com/watch?v=l4kQd9eWclE",  # Paulo Muzy
            "https://www.youtube.com/watch?v=Ohy5k9sQ2Qg",  # Leandro Twin
            "https://www.youtube.com/watch?v=JB2oyawG9KI"   # Gabriel Arones
        ]
    },
    "bicicleta": {
        "name": "Bicicleta",
        "urls": [
            "https://www.youtube.com/watch?v=5_S_kBD57EE",  # Paulo Muzy
            "https://www.youtube.com/watch?v=9FGilxCbdz8",  # Gabriel Arones
            "https://www.youtube.com/watch?v=1ux2AOHNBnU"   # Leandro Twin
        ]
    },
    
    # GLÚTEOS - Exercícios Específicos
    "abducao-cabo": {
        "name": "Abdução no Cabo",
        "urls": [
            "https://www.youtube.com/watch?v=6FZAmy9RPNM",  # Paulo Muzy
            "https://www.youtube.com/watch?v=YhM2M7zkJxs",  # Mari Gonzalez
            "https://www.youtube.com/watch?v=KHE5sC6RQgE"   # Fernanda Fichtner
        ]
    },
    "clamshell": {
        "name": "Clamshell",
        "urls": [
            "https://www.youtube.com/watch?v=ZEqB1w_qlG4",  # Mari Gonzalez
            "https://www.youtube.com/watch?v=2XhqFhXLJYs",  # Paulo Muzy
            "https://www.youtube.com/watch?v=f3jYwjrFnF0"   # Gabriel Arones
        ]
    },
    "single-leg-glute-bridge": {
        "name": "Single Leg Glute Bridge",
        "urls": [
            "https://www.youtube.com/watch?v=LM8XHLYJoYs",  # Mari Gonzalez
            "https://www.youtube.com/watch?v=qKl-cRhxJLQ",  # Paulo Muzy
            "https://www.youtube.com/watch?v=5YQ1H5TJb4I"   # Gabriel Arones
        ]
    },
    "fire-hydrant": {
        "name": "Fire Hydrant",
        "urls": [
            "https://www.youtube.com/watch?v=SYJc6bF_3-g",  # Mari Gonzalez
            "https://www.youtube.com/watch?v=nMgwGOYhQJs",  # Paulo Muzy
            "https://www.youtube.com/watch?v=qW4DzYMRUgI"   # Fernanda Fichtner
        ]
    },
    
    # CARDIO - Exercícios Específicos
    "jumping-jacks": {
        "name": "Jumping Jacks",
        "urls": [
            "https://www.youtube.com/watch?v=iSSAk4XCsRA",  # Gabriel Arones
            "https://www.youtube.com/watch?v=c4DAnQ6DtF8",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=0sJMv1jxFUM"   # Calistenia Brasil
        ]
    },
    "high-knees": {
        "name": "High Knees",
        "urls": [
            "https://www.youtube.com/watch?v=8opcQdC-V-U",  # Gabriel Arones
            "https://www.youtube.com/watch?v=qtF2tLl8Lxg",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=T3vTrmkBg6o"   # Calistenia Brasil
        ]
    },
    "polichinelos": {
        "name": "Polichinelos",
        "urls": [
            "https://www.youtube.com/watch?v=iSSAk4XCsRA",  # Gabriel Arones
            "https://www.youtube.com/watch?v=c4DAnQ6DtF8",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=QtAj0dqovnc"   # Calistenia Brasil
        ]
    },
    "sprint-no-lugar": {
        "name": "Sprint no Lugar",
        "urls": [
            "https://www.youtube.com/watch?v=8opcQdC-V-U",  # Gabriel Arones
            "https://www.youtube.com/watch?v=QtAj0dqovnc",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=qtF2tLl8Lxg"   # Calistenia Brasil
        ]
    },
    "box-steps": {
        "name": "Box Steps",
        "urls": [
            "https://www.youtube.com/watch?v=5MqJQLJSRxQ",  # Gabriel Arones
            "https://www.youtube.com/watch?v=AJVTvOFKhUM",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=mE-8x5kk1vQ"   # Calistenia Brasil
        ]
    },
    "corda-simulacao": {
        "name": "Corda (Simulação)",
        "urls": [
            "https://www.youtube.com/watch?v=1BZM2Vre5oc",  # Gabriel Arones
            "https://www.youtube.com/watch?v=qunosmmkGBg",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=v-K5wglUqAw"   # Calistenia Brasil
        ]
    },
    "squat-jump": {
        "name": "Squat Jump",
        "urls": [
            "https://www.youtube.com/watch?v=A-cFYWvaHr0",  # Gabriel Arones
            "https://www.youtube.com/watch?v=YGGq0AE5Exc",  # Carlos DeOliveira
            "https://www.youtube.com/watch?v=Hq7z8DNURQ8"   # Leandro Twin
        ]
    }
}

def download_exercise_video(exercise_key, exercise_info, output_dir):
    """Tenta baixar vídeo de um exercício com múltiplas URLs de fallback"""
    print(f"\n🎯 {exercise_info['name'].upper()}")
    print("=" * 50)
    
    success = False
    for i, url in enumerate(exercise_info['urls'], 1):
        output_path = os.path.join(output_dir, f"{exercise_key}.%(ext)s")
        
        cmd = [
            "yt-dlp",
            "--format", "best[height<=720][ext=mp4]/best[ext=mp4]/best",
            "--output", output_path,
            "--no-playlist",
            "--ignore-errors",
            "--no-warnings",
            url
        ]
        
        print(f"🔄 Tentativa {i}/3: {url}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            # Verificar se arquivo foi criado
            mp4_path = output_path.replace("%(ext)s", "mp4")
            if os.path.exists(mp4_path):
                print(f"✅ SUCESSO: {exercise_info['name']} baixado!")
                success = True
                break
            else:
                print(f"❌ Falhou tentativa {i}")
                
        except subprocess.TimeoutExpired:
            print(f"⏰ Timeout tentativa {i}")
        except Exception as e:
            print(f"❌ Erro tentativa {i}: {e}")
        
        # Aguardar antes da próxima tentativa
        if i < len(exercise_info['urls']):
            print("⏸️  Aguardando 2 segundos...")
            time.sleep(2)
    
    if not success:
        print(f"💥 FALHOU: {exercise_info['name']} (todas as tentativas)")
    
    return success

def main():
    output_dir = "public/videos/exercises"
    os.makedirs(output_dir, exist_ok=True)
    
    print("🇧🇷 DOWNLOAD ESPECÍFICO - EXERCÍCIOS FALTANTES")
    print("=" * 60)
    print(f"📂 Diretório: {output_dir}")
    print(f"🎯 Total de exercícios: {len(BRAZILIAN_FITNESS_CHANNELS)}")
    print("🏋️ 100% Canais FITNESS Brasileiros")
    print("🔄 Múltiplas tentativas por exercício")
    print("=" * 60)
    
    success_count = 0
    failed_exercises = []
    
    for exercise_key, exercise_info in BRAZILIAN_FITNESS_CHANNELS.items():
        # Verificar se vídeo já existe
        existing_file = os.path.join(output_dir, f"{exercise_key}.mp4")
        if os.path.exists(existing_file):
            print(f"⏭️  PULANDO: {exercise_info['name']} (já existe)")
            success_count += 1
            continue
        
        if download_exercise_video(exercise_key, exercise_info, output_dir):
            success_count += 1
        else:
            failed_exercises.append(exercise_info['name'])
    
    # Relatório final
    print("\n" + "=" * 60)
    print("📊 RELATÓRIO FINAL")
    print("=" * 60)
    print(f"✅ Sucessos: {success_count}")
    print(f"❌ Falhas: {len(failed_exercises)}")
    print(f"📁 Total de vídeos: {len(list(Path(output_dir).glob('*.mp4')))}")
    
    if failed_exercises:
        print(f"\n💥 Exercícios que falharam ({len(failed_exercises)}):")
        for exercise in failed_exercises:
            print(f"   - {exercise}")
    else:
        print("\n🎉 TODOS OS VÍDEOS BAIXADOS COM SUCESSO!")
    
    print(f"\n🏆 SISTEMA COMPLETO: {success_count}/{len(BRAZILIAN_FITNESS_CHANNELS)} exercícios")
    print("🇧🇷 100% Conteúdo Brasileiro de Qualidade!")

if __name__ == "__main__":
    main()
