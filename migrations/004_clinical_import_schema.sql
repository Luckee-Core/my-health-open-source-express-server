-- My Health — clinical import schema (allergies, meds, conditions, vitals, results, notes, referrals, insurance, imports)
-- Prerequisites: 001–003 (or setup.sql through 003).
-- Apply: psql "$DATABASE_URL" -f migrations/004_clinical_import_schema.sql
-- Portable Postgres (also works when DATABASE_URL points at Supabase Postgres). No RLS / auth.users in OSS v1.

-- ---------------------------------------------------------------------------
-- Extend care team + visit tables
-- ---------------------------------------------------------------------------

ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS npi TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS fax TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_doctors_npi_unique
  ON public.doctors (npi)
  WHERE npi IS NOT NULL AND trim(npi) <> '';

-- Provenance columns (nullable — manual rows leave null; importer sets them)
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

-- ---------------------------------------------------------------------------
-- Import batches + server-side full draft
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- Clinical gap tables
-- ---------------------------------------------------------------------------

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

-- Seed specialty used when encounter has no clinician
INSERT INTO public.specialties (name)
SELECT 'Unspecified'
WHERE NOT EXISTS (
  SELECT 1 FROM public.specialties s WHERE lower(trim(s.name)) = lower(trim('Unspecified'))
);
