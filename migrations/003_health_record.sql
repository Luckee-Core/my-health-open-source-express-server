-- My Health — medical history, symptom logs, and research notes
-- Prerequisites: run 001 and 002 first (creates doctors, appointments, focus_areas).
-- Apply with psql: psql "$DATABASE_URL" -f migrations/003_health_record.sql

CREATE TABLE IF NOT EXISTS public.medical_history_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  focus_area_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medical_history_events_event_date
  ON public.medical_history_events (event_date DESC);

CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  severity SMALLINT CHECK (severity IS NULL OR (severity >= 1 AND severity <= 10)),
  triggers TEXT,
  duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  notes TEXT,
  focus_area_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_recorded_at
  ON public.symptom_logs (recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.research_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  source_url TEXT,
  summary TEXT,
  content TEXT,
  focus_area_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_notes_created_at
  ON public.research_notes (created_at DESC);
