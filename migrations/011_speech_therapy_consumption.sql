-- My Health — speech therapy consumption (ice cubes today; more types later)
-- Apply with psql: psql "$DATABASE_URL" -f migrations/011_speech_therapy_consumption.sql

CREATE TABLE IF NOT EXISTS public.speech_therapy_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumption_type TEXT NOT NULL
    CHECK (consumption_type IN ('ice_cube')),
  log_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_speech_therapy_consumption_type_date
  ON public.speech_therapy_consumption (consumption_type, log_date);

CREATE INDEX IF NOT EXISTS idx_speech_therapy_consumption_log_date
  ON public.speech_therapy_consumption (log_date DESC);
