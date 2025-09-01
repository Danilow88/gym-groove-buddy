# Keegan Gym Buddy (Python, Streamlit + Supabase)

Single-file Streamlit app that mirrors the existing TS app features, with optional Supabase sync.

## Run Locally

1) Create and activate a Python 3.10+ environment
2) Install deps:

```bash
pip install -r requirements.txt
```

3) Export Supabase creds (optional for cloud sync):

```bash
export SUPABASE_URL="https://<your-project>.supabase.co"
export SUPABASE_ANON_KEY="<your-anon-key>"
```

4) Start the app:

```bash
streamlit run app.py
```

## Supabase Schema

Create these tables in your Supabase project:

```sql
create table if not exists public.workout_sessions (
  id uuid primary key,
  date timestamptz not null default now()
);

create table if not exists public.workout_sets (
  id uuid primary key,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id text not null,
  weight numeric not null,
  reps integer not null,
  timestamp timestamptz not null default now()
);
```

Add appropriate RLS policies for anon inserts/selects if needed.

## Notes
- If env vars are missing, the app stores history locally in session state.
- The pre-seeded exercise list mirrors the TS app mock data.