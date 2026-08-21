-- My Health — provenance tables, symptom definitions, AI extract staging (relational)
-- Prerequisites: 001–004 (or setup.sql).
-- Apply: psql "$DATABASE_URL" -f migrations/005_provenance_symptom_definitions_ai_extract.sql

-- ---------------------------------------------------------------------------
-- Source systems & instances
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.source_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.source_systems (code, name) VALUES
  ('manual', 'Manual entry'),
  ('mychart', 'MyChart'),
  ('paste', 'Paste import'),
  ('ccd_import', 'C-CDA import')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.source_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system_id UUID NOT NULL REFERENCES public.source_systems(id) ON DELETE RESTRICT,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_source_instances_system
  ON public.source_instances (source_system_id);

-- ---------------------------------------------------------------------------
-- Document uploads (ingest registry)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_instance_id UUID REFERENCES public.source_instances(id) ON DELETE SET NULL,
  ingest_kind TEXT NOT NULL
    CHECK (ingest_kind IN ('file', 'paste', 'photo', 'ccd_zip')),
  report_type TEXT NOT NULL,
  original_filename TEXT,
  content_sha256 TEXT NOT NULL,
  report_date DATE,
  provider_name TEXT,
  storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'processing', 'review', 'committed', 'failed', 'duplicate_rejected'
    )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_document_uploads_content_sha256
  ON public.document_uploads (content_sha256);

CREATE INDEX IF NOT EXISTS idx_document_uploads_dedup_meta
  ON public.document_uploads (
    source_instance_id, report_type, original_filename, report_date
  );

-- ---------------------------------------------------------------------------
-- Clinical record provenance junction
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.clinical_record_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_table TEXT NOT NULL,
  entity_id UUID NOT NULL,
  upload_id UUID REFERENCES public.document_uploads(id) ON DELETE SET NULL,
  source_instance_id UUID REFERENCES public.source_instances(id) ON DELETE SET NULL,
  source_entry_key TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_record_sources_entity
  ON public.clinical_record_sources (entity_table, entity_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinical_record_sources_entry
  ON public.clinical_record_sources (entity_table, source_instance_id, source_entry_key)
  WHERE source_entry_key IS NOT NULL AND source_instance_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Symptom definitions & check-in fields
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.symptom_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.symptom_definitions (name, sort_order) VALUES
  ('Head pain', 10),
  ('Facial pressure', 20),
  ('Nausea', 30),
  ('Dizziness', 40),
  ('Fatigue', 50)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.symptom_logs
  ADD COLUMN IF NOT EXISTS symptom_definition_id UUID
    REFERENCES public.symptom_definitions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS time_period TEXT
    CHECK (
      time_period IS NULL
      OR time_period IN ('last_night', 'this_morning', 'now', 'other')
    );

CREATE INDEX IF NOT EXISTS idx_symptom_logs_check_in
  ON public.symptom_logs (symptom_definition_id, time_period, recorded_at DESC);

-- ---------------------------------------------------------------------------
-- AI extract staging (relational — no JSONB on proposals)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ai_extract_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES public.document_uploads(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('medications', 'conditions')),
  status TEXT NOT NULL DEFAULT 'review'
    CHECK (status IN ('review', 'committed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_extract_medication_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_extract_sessions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  instructions TEXT,
  started_on DATE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'stopped')),
  notes TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_extract_medication_proposals_session
  ON public.ai_extract_medication_proposals (session_id, sort_order);

CREATE TABLE IF NOT EXISTS public.ai_extract_condition_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_extract_sessions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  clinical_status TEXT NOT NULL DEFAULT 'active'
    CHECK (clinical_status IN ('active', 'resolved')),
  noted_on DATE,
  diagnosed_on DATE,
  notes TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_extract_condition_proposals_session
  ON public.ai_extract_condition_proposals (session_id, sort_order);
