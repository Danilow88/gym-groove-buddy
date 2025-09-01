import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import streamlit as st
from supabase import create_client, Client


# -----------------------------
# Supabase Client Initialization
# -----------------------------
def get_supabase_client() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL") or "https://gqpikdwbuxnxifgekwqr.supabase.co"
    key = os.getenv("SUPABASE_ANON_KEY") or (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcGlrZHdidXhueGlmZ2Vrd3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2OTI5NjgsImV4cCI6MjA3MjI2ODk2OH0.wFzjreKscPs3jXp4m8KQ0mzMePfdq0rl7TDg7XBLyl8"
    )
    try:
        client: Client = create_client(url, key)
        # Lightweight call to ensure credentials are valid
        client.auth.get_session()
        return client
    except Exception:
        return None


# -----------------------------
# Domain Models and Seed Data
# -----------------------------
Exercise = Dict[str, object]
WorkoutSet = Dict[str, object]
WorkoutSession = Dict[str, object]


def seed_exercises() -> List[Exercise]:
    return [
        # PEITO
        {
            "id": "1",
            "name": "Supino Reto",
            "muscle": "Peito",
            "description": "Exercício básico para desenvolvimento do peitoral maior",
            "videoUrl": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
            "lastWeight": 80,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "2",
            "name": "Supino Inclinado",
            "muscle": "Peito",
            "description": "Foca na parte superior do peitoral",
            "videoUrl": "https://www.youtube.com/watch?v=jbBq-HuOLq4",
            "lastWeight": 70,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "3",
            "name": "Flexão de Braço",
            "muscle": "Peito",
            "description": "Exercício com peso corporal para peitoral",
            "videoUrl": "https://www.youtube.com/watch?v=IODxDxX7oi4",
            "lastWeight": 0,
            "lastReps": 15,
            "lastSets": 3,
        },
        {
            "id": "4",
            "name": "Crucifixo",
            "muscle": "Peito",
            "description": "Isolamento do peitoral com halteres",
            "videoUrl": "https://www.youtube.com/watch?v=eozdVDA78K0",
            "lastWeight": 20,
            "lastReps": 12,
            "lastSets": 3,
        },
        # COSTAS
        {
            "id": "5",
            "name": "Remada Curvada",
            "muscle": "Costas",
            "description": "Excelente para desenvolvimento do latíssimo do dorso",
            "videoUrl": "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
            "lastWeight": 70,
            "lastReps": 8,
            "lastSets": 3,
        },
        {
            "id": "6",
            "name": "Pull Down",
            "muscle": "Costas",
            "description": "Trabalha latíssimo e redondo maior",
            "videoUrl": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
            "lastWeight": 60,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "7",
            "name": "Remada Baixa",
            "muscle": "Costas",
            "description": "Foca na parte média das costas",
            "videoUrl": "https://www.youtube.com/watch?v=xQNrFHEMhI4",
            "lastWeight": 65,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "8",
            "name": "Levantamento Terra",
            "muscle": "Costas",
            "description": "Exercício composto para toda a cadeia posterior",
            "videoUrl": "https://www.youtube.com/watch?v=ytGaGIn3SjE",
            "lastWeight": 100,
            "lastReps": 6,
            "lastSets": 3,
        },
        # PERNAS
        {
            "id": "9",
            "name": "Agachamento",
            "muscle": "Pernas",
            "description": "Movimento fundamental para fortalecimento das pernas",
            "videoUrl": "https://www.youtube.com/watch?v=Dy28eq2PjcM",
            "lastWeight": 100,
            "lastReps": 12,
            "lastSets": 4,
        },
        {
            "id": "10",
            "name": "Leg Press",
            "muscle": "Pernas",
            "description": "Exercício para quadríceps e glúteos",
            "videoUrl": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
            "lastWeight": 200,
            "lastReps": 15,
            "lastSets": 3,
        },
        {
            "id": "11",
            "name": "Extensão de Pernas",
            "muscle": "Pernas",
            "description": "Isolamento do quadríceps",
            "videoUrl": "https://www.youtube.com/watch?v=YyvSfVjQeL0",
            "lastWeight": 50,
            "lastReps": 15,
            "lastSets": 3,
        },
        {
            "id": "12",
            "name": "Mesa Flexora",
            "muscle": "Pernas",
            "description": "Isolamento dos posteriores de coxa",
            "videoUrl": "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
            "lastWeight": 40,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "13",
            "name": "Elevação Panturrilha",
            "muscle": "Pernas",
            "description": "Exercício para panturrilhas",
            "videoUrl": "https://www.youtube.com/watch?v=JsAqKhGnxrE",
            "lastWeight": 80,
            "lastReps": 20,
            "lastSets": 4,
        },
        # OMBROS
        {
            "id": "14",
            "name": "Desenvolvimento",
            "muscle": "Ombros",
            "description": "Trabalha deltoides anterior, medial e posterior",
            "videoUrl": "https://www.youtube.com/watch?v=qEwKCR5JCog",
            "lastWeight": 40,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "15",
            "name": "Elevação Lateral",
            "muscle": "Ombros",
            "description": "Isolamento do deltoide medial",
            "videoUrl": "https://www.youtube.com/watch?v=3VcKaXpzqRo",
            "lastWeight": 15,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "16",
            "name": "Elevação Frontal",
            "muscle": "Ombros",
            "description": "Trabalha a parte anterior do deltoide",
            "videoUrl": "https://www.youtube.com/watch?v=qEwKCR5JCog",
            "lastWeight": 12,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "17",
            "name": "Elevação Posterior",
            "muscle": "Ombros",
            "description": "Foca no deltoide posterior",
            "videoUrl": "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
            "lastWeight": 10,
            "lastReps": 15,
            "lastSets": 3,
        },
        # BÍCEPS
        {
            "id": "18",
            "name": "Rosca Direta",
            "muscle": "Bíceps",
            "description": "Isolamento do bíceps braquial",
            "videoUrl": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
            "lastWeight": 30,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "19",
            "name": "Rosca Martelo",
            "muscle": "Bíceps",
            "description": "Trabalha bíceps e antebraço",
            "videoUrl": "https://www.youtube.com/watch?v=zC3nLlEvin4",
            "lastWeight": 25,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "20",
            "name": "Rosca Scott",
            "muscle": "Bíceps",
            "description": "Isolamento máximo do bíceps",
            "videoUrl": "https://www.youtube.com/watch?v=uO_CNh3rkLo",
            "lastWeight": 20,
            "lastReps": 10,
            "lastSets": 3,
        },
        # TRÍCEPS
        {
            "id": "21",
            "name": "Tríceps Testa",
            "muscle": "Tríceps",
            "description": "Exercício de isolamento para tríceps",
            "videoUrl": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
            "lastWeight": 25,
            "lastReps": 12,
            "lastSets": 3,
        },
        {
            "id": "22",
            "name": "Mergulho",
            "muscle": "Tríceps",
            "description": "Exercício com peso corporal para tríceps",
            "videoUrl": "https://www.youtube.com/watch?v=2z8JmcrW-As",
            "lastWeight": 0,
            "lastReps": 10,
            "lastSets": 3,
        },
        {
            "id": "23",
            "name": "Tríceps Pulley",
            "muscle": "Tríceps",
            "description": "Isolamento do tríceps no cabo",
            "videoUrl": "https://www.youtube.com/watch?v=vB5OHsJ3EME",
            "lastWeight": 30,
            "lastReps": 12,
            "lastSets": 3,
        },
        # ABDÔMEN
        {
            "id": "24",
            "name": "Abdominal Reto",
            "muscle": "Abdômen",
            "description": "Exercício básico para reto abdominal",
            "videoUrl": "https://www.youtube.com/watch?v=jDwoBqPH0jk",
            "lastWeight": 0,
            "lastReps": 20,
            "lastSets": 3,
        },
        {
            "id": "25",
            "name": "Prancha",
            "muscle": "Abdômen",
            "description": "Exercício isométrico para core",
            "videoUrl": "https://www.youtube.com/watch?v=TvxNkmjdhMM",
            "lastWeight": 0,
            "lastReps": 60,
            "lastSets": 3,
        },
        {
            "id": "26",
            "name": "Abdominal Oblíquo",
            "muscle": "Abdômen",
            "description": "Trabalha os músculos oblíquos",
            "videoUrl": "https://www.youtube.com/watch?v=8ioA-ycHOCo",
            "lastWeight": 0,
            "lastReps": 15,
            "lastSets": 3,
        },
    ]


def get_muscle_groups(exercises: List[Exercise]) -> List[str]:
    return ["Todos", *sorted({e["muscle"] for e in exercises})]


def filter_exercises(exercises: List[Exercise], group: str) -> List[Exercise]:
    if group == "Todos":
        return exercises
    return [e for e in exercises if e["muscle"] == group]


# -----------------------------
# Persistence Helpers
# -----------------------------
def persist_workout(supabase: Optional[Client], sets: List[WorkoutSet]) -> Optional[str]:
    if not supabase:
        return None
    if not sets:
        return None

    session_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()
    try:
        supabase.table("workout_sessions").insert({
            "id": session_id,
            "date": now_iso,
        }).execute()

        rows = [
            {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "exercise_id": s["exerciseId"],
                "weight": s["weight"],
                "reps": s["reps"],
                "timestamp": s["timestamp"],
            }
            for s in sets
        ]
        supabase.table("workout_sets").insert(rows).execute()
        return session_id
    except Exception as ex:
        st.warning(f"Não foi possível salvar no Supabase: {ex}")
        return None


def fetch_history(supabase: Optional[Client]) -> List[WorkoutSession]:
    if not supabase:
        return []
    try:
        sessions_resp = (
            supabase.table("workout_sessions")
            .select("id,date")
            .order("date", desc=True)
            .limit(50)
            .execute()
        )
        sessions = sessions_resp.data or []
        history: List[WorkoutSession] = []
        for sess in sessions:
            sets_resp = (
                supabase.table("workout_sets")
                .select("id,exercise_id,weight,reps,timestamp")
                .eq("session_id", sess["id"])
                .order("timestamp")
                .execute()
            )
            sets = [
                {
                    "id": s["id"],
                    "exerciseId": s["exercise_id"],
                    "weight": s["weight"],
                    "reps": s["reps"],
                    "timestamp": s["timestamp"],
                }
                for s in (sets_resp.data or [])
            ]
            history.append(
                {
                    "id": sess["id"],
                    "date": sess["date"],
                    "sets": sets,
                }
            )
        return history
    except Exception as ex:
        st.warning(f"Erro ao buscar histórico do Supabase: {ex}")
        return []


# -----------------------------
# UI
# -----------------------------
st.set_page_config(page_title="Keegan Gym Buddy", page_icon="🏋️", layout="centered")

if "exercises" not in st.session_state:
    st.session_state.exercises = seed_exercises()
if "current_sets" not in st.session_state:
    st.session_state.current_sets: List[WorkoutSet] = []
if "workout_history_local" not in st.session_state:
    st.session_state.workout_history_local: List[WorkoutSession] = []

supabase_client = get_supabase_client()

st.sidebar.title("Keegan")
page = st.sidebar.radio("Navegação", ["Início", "Treino", "Histórico", "Perfil"])


def keegan_tip() -> str:
    return (
        "Mantenha sempre uma boa postura durante os exercícios. A técnica correta é mais importante que a carga utilizada."
    )


def render_home():
    st.title("Keegan Gym Buddy")
    st.caption("Seu companheiro de treino definitivo")

    st.success("Pronto para treinar?")
    if st.button("Iniciar Treino ▶️"):
        st.session_state["__nav_jump"] = "Treino"

    st.subheader("Dica do Dia ✨")
    st.write(keegan_tip())

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Treinos", len(st.session_state.get("workout_history_local", [])))
    with col2:
        total_sets = sum(len(s["sets"]) for s in st.session_state.get("workout_history_local", []))
        st.metric("Séries", total_sets)
    with col3:
        # Sessions in last 7 days (local only)
        today = datetime.utcnow()
        week_ago = today - timedelta(days=7)
        count_week = sum(1 for s in st.session_state.get("workout_history_local", []) if datetime.fromisoformat(str(s["date"])) >= week_ago)
        st.metric("Esta semana", count_week)


def render_workout():
    st.title("Treino")
    st.caption("Selecione os exercícios e registre suas séries")

    groups = get_muscle_groups(st.session_state.exercises)
    selected_group = st.selectbox("Grupo muscular", groups, index=0)

    # Listing
    for ex in filter_exercises(st.session_state.exercises, selected_group):
        with st.expander(f"{ex['name']} ({ex['muscle']})"):
            st.write(ex["description"]) 
            if ex.get("videoUrl"):
                st.markdown(f"[Vídeo]({ex['videoUrl']})")

            cols = st.columns([1, 1, 1])
            with cols[0]:
                weight = st.number_input(f"Peso (kg) — {ex['id']}", min_value=0, max_value=1000, value=int(ex.get("lastWeight", 0)))
            with cols[1]:
                reps = st.number_input(f"Reps — {ex['id']}", min_value=1, max_value=1000, value=int(ex.get("lastReps", 10)))
            with cols[2]:
                add = st.button("Adicionar série", key=f"add_{ex['id']}")
            if add:
                st.session_state.current_sets.append(
                    {
                        "id": str(uuid.uuid4()),
                        "exerciseId": ex["id"],
                        "weight": float(weight),
                        "reps": int(reps),
                        "timestamp": datetime.utcnow().isoformat(),
                    }
                )
                st.success(f"Série adicionada: {weight}kg x {reps} reps")

            # Current sets for exercise
            current_sets = [s for s in st.session_state.current_sets if s["exerciseId"] == ex["id"]]
            if current_sets:
                st.markdown("Séries de hoje:")
                for idx, s in enumerate(current_sets, start=1):
                    st.text(f"Série {idx}: {s['weight']}kg × {s['reps']} reps")

    st.divider()
    if st.session_state.current_sets:
        if st.button("Finalizar treino ⏹️"):
            session_id = persist_workout(supabase_client, st.session_state.current_sets)
            session: WorkoutSession = {
                "id": session_id or str(uuid.uuid4()),
                "date": datetime.utcnow().isoformat(),
                "sets": list(st.session_state.current_sets),
            }
            st.session_state.workout_history_local.insert(0, session)
            st.session_state.current_sets.clear()
            st.success("Treino finalizado! Parabéns! Seu treino foi salvo no histórico.")
    else:
        st.info("Nenhuma série adicionada ainda.")


def render_history():
    st.title("Histórico")
    history = fetch_history(supabase_client)
    # Merge remote with local-only sessions (if any)
    merged = history or []
    for local_s in st.session_state.workout_history_local:
        if not any(s["id"] == local_s["id"] for s in merged):
            merged.append(local_s)

    if not merged:
        st.info("Nenhum treino ainda. Comece seu primeiro treino para ver o histórico aqui.")
        return

    for session in sorted(merged, key=lambda s: s["date"], reverse=True):
        date_label = datetime.fromisoformat(str(session["date"]))
        st.subheader(date_label.strftime("%A, %d de %B"))
        st.caption(f"{date_label.strftime('%H:%M')} • {len(session['sets'])} séries")

        # Group sets by exercise
        groups: Dict[str, List[WorkoutSet]] = {}
        for s in session["sets"]:
            groups.setdefault(s["exerciseId"], []).append(s)

        for exercise_id, sets in groups.items():
            name = next((e["name"] for e in st.session_state.exercises if e["id"] == exercise_id), "Exercício desconhecido")
            with st.expander(name):
                cols = st.columns(3)
                for idx, s in enumerate(sets, start=1):
                    with cols[(idx - 1) % 3]:
                        st.text(f"Série {idx}: {s['weight']}kg × {s['reps']}")


def render_profile():
    st.title("Perfil")

    # Compute stats from remote history if available, else local
    remote_history = fetch_history(supabase_client)
    history = remote_history or st.session_state.get("workout_history_local", [])

    total_workouts = len(history)
    total_sets = sum(len(s["sets"]) for s in history)
    today = datetime.utcnow()
    week_ago = today - timedelta(days=7)
    this_week = sum(1 for s in history if datetime.fromisoformat(str(s["date"])) >= week_ago)

    st.metric("Treinos", total_workouts)
    st.metric("Séries", total_sets)
    st.metric("Esta semana", this_week)

    st.divider()
    st.subheader("Configurações")
    st.caption("Configure as variáveis SUPABASE_URL e SUPABASE_ANON_KEY para sincronização na nuvem.")


# Router
if page == "Início":
    render_home()
elif page == "Treino":
    render_workout()
elif page == "Histórico":
    render_history()
elif page == "Perfil":
    render_profile()

# Handle quick navigation jump
if st.session_state.get("__nav_jump"):
    target = st.session_state.pop("__nav_jump")
    if target in ("Treino", "Histórico", "Perfil", "Início"):
        st.switch_page("app.py")

