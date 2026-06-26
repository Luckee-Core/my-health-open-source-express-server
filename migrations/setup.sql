-- My Health — full schema (run this one file)
-- psql "$DATABASE_URL" -f migrations/setup.sql
-- Safe to re-run: uses IF NOT EXISTS throughout.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 001: care team + appointments
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hospitals_name_lower
  ON public.hospitals (lower(trim(name)));

CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_specialties_name_lower
  ON public.specialties (lower(trim(name)));

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE RESTRICT,
  specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON public.doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty_id ON public.doctors(specialty_id);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  appointment_type TEXT,
  reason TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

INSERT INTO public.specialties (name)
SELECT v.name
FROM (
  VALUES
    ('Primary Care'),
    ('Cardiology'),
    ('Orthopedics'),
    ('Dermatology'),
    ('Neurology')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.specialties s WHERE lower(trim(s.name)) = lower(trim(v.name))
);

-- 002: journal
CREATE TABLE IF NOT EXISTS public.focus_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_focus_areas_name_lower
  ON public.focus_areas (lower(trim(name)));

CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  focus_area_id UUID NOT NULL REFERENCES public.focus_areas(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_entries_date_focus_area
  ON public.daily_entries (entry_date, focus_area_id);

CREATE INDEX IF NOT EXISTS idx_daily_entries_entry_date
  ON public.daily_entries (entry_date DESC);

INSERT INTO public.focus_areas (name, description)
SELECT v.name, v.description
FROM (
  VALUES
    ('Headaches', 'Morning pressure, duration, what helps'),
    ('Waking up in the morning', 'Energy, grogginess, time to feel functional'),
    ('Cancer', 'Follow-up symptoms, treatment side effects, concerns for oncologist'),
    ('Breathing', 'Shortness of breath, exercise tolerance')
) AS v(name, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.focus_areas f WHERE lower(trim(f.name)) = lower(trim(v.name))
);

-- 003: health record
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
