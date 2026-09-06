-- My Health — speech therapy exercises, daily logs, and photo imports
-- Apply with psql: psql "$DATABASE_URL" -f migrations/005_therapy_speech.sql

CREATE TABLE IF NOT EXISTS public.therapy_exercise_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'previewed'
    CHECK (status IN ('previewed', 'committed')),
  draft_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_therapy_exercise_imports_status
  ON public.therapy_exercise_imports (status);

CREATE TABLE IF NOT EXISTS public.therapy_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline TEXT NOT NULL DEFAULT 'speech'
    CHECK (discipline IN ('speech')),
  name TEXT NOT NULL,
  instructions TEXT,
  tracking_kind TEXT NOT NULL
    CHECK (tracking_kind IN ('timed_attempts', 'sets_reps')),
  target_count INTEGER NOT NULL CHECK (target_count > 0),
  unit_size INTEGER NOT NULL DEFAULT 1 CHECK (unit_size > 0),
  frequency TEXT NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'photo_import')),
  import_id UUID REFERENCES public.therapy_exercise_imports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_therapy_exercises_discipline_active
  ON public.therapy_exercises (discipline, is_active, sort_order);

CREATE TABLE IF NOT EXISTS public.therapy_exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.therapy_exercises(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  completed_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_count >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_therapy_exercise_logs_exercise_date
  ON public.therapy_exercise_logs (exercise_id, log_date);

CREATE INDEX IF NOT EXISTS idx_therapy_exercise_logs_log_date
  ON public.therapy_exercise_logs (log_date DESC);
