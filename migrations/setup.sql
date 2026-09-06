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

-- 004: clinical import (doctors extensions + provenance + gap tables)
-- Mirrored from 004_clinical_import_schema.sql — keep in sync.

ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS npi TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS fax TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_doctors_npi_unique
  ON public.doctors (npi)
  WHERE npi IS NOT NULL AND trim(npi) <> '';

ALTER TABLE public.hospitals
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

ALTER TABLE public.specialties
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

ALTER TABLE public.medical_history_events
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

ALTER TABLE public.symptom_logs
  ADD COLUMN IF NOT EXISTS source_system TEXT,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_entry_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_hospitals_source_entry
  ON public.hospitals (source_system, source_entry_key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_specialties_source_entry
  ON public.specialties (source_system, source_entry_key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_doctors_source_entry
  ON public.doctors (source_system, source_entry_key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_source_entry
  ON public.appointments (source_system, source_entry_key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medical_history_events_source_entry
  ON public.medical_history_events (source_system, source_entry_key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_symptom_logs_source_entry
  ON public.symptom_logs (source_system, source_entry_key);

CREATE TABLE IF NOT EXISTS public.health_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  content_sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'previewed'
    CHECK (status IN ('previewed', 'committed', 'failed')),
  document_count INTEGER NOT NULL DEFAULT 0,
  summary_json JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_imports_created_at
  ON public.health_imports (created_at DESC);

CREATE TABLE IF NOT EXISTS public.health_import_drafts (
  health_import_id UUID PRIMARY KEY REFERENCES public.health_imports(id) ON DELETE CASCADE,
  draft_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  substance TEXT NOT NULL,
  reaction TEXT,
  criticality TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_allergies_source_entry
  ON public.allergies (source_system, source_entry_key);

CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  instructions TEXT,
  started_on DATE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'stopped')),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  notes TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medications_source_entry
  ON public.medications (source_system, source_entry_key);

CREATE INDEX IF NOT EXISTS idx_medications_doctor_id ON public.medications(doctor_id);

CREATE TABLE IF NOT EXISTS public.conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'resolved')),
  noted_on DATE,
  diagnosed_on DATE,
  focus_area_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL,
  notes TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conditions_source_entry
  ON public.conditions (source_system, source_entry_key);

CREATE TABLE IF NOT EXISTS public.vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL,
  metric TEXT NOT NULL
    CHECK (metric IN (
      'blood_pressure', 'pulse', 'temperature', 'respiratory_rate',
      'oxygen_saturation', 'weight', 'height', 'bmi', 'other'
    )),
  value_text TEXT NOT NULL,
  numeric_value DOUBLE PRECISION,
  unit TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vital_signs_source_entry
  ON public.vital_signs (source_system, source_entry_key);

CREATE INDEX IF NOT EXISTS idx_vital_signs_recorded_at
  ON public.vital_signs (recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.clinical_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observed_at TIMESTAMPTZ,
  name TEXT NOT NULL,
  value_text TEXT,
  unit TEXT,
  interpretation TEXT,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('lab', 'imaging', 'other')),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinical_results_source_entry
  ON public.clinical_results (source_system, source_entry_key);

CREATE INDEX IF NOT EXISTS idx_clinical_results_observed_at
  ON public.clinical_results (observed_at DESC NULLS LAST);

CREATE TABLE IF NOT EXISTS public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_at TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT,
  body TEXT NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinical_notes_source_entry
  ON public.clinical_notes (source_system, source_entry_key);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_note_at
  ON public.clinical_notes (note_at DESC);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referred_on DATE,
  specialty TEXT,
  reason TEXT,
  status TEXT,
  referred_by_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  notes TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_source_entry
  ON public.referrals (source_system, source_entry_key);

CREATE TABLE IF NOT EXISTS public.insurance_coverages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_name TEXT NOT NULL,
  member_id TEXT,
  group_number TEXT,
  plan_name TEXT,
  status TEXT,
  source_system TEXT,
  source_document_id TEXT,
  source_entry_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_insurance_coverages_source_entry
  ON public.insurance_coverages (source_system, source_entry_key);

INSERT INTO public.specialties (name)
SELECT 'Unspecified'
WHERE NOT EXISTS (
  SELECT 1 FROM public.specialties s WHERE lower(trim(s.name)) = lower(trim('Unspecified'))
);

-- 005: speech therapy exercises, logs, and photo imports
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
