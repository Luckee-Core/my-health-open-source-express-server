-- My Health — medication dose schedules and dose logs (interval reminders)
-- Prerequisites: 001–004 (medications table).
-- Apply: psql "$DATABASE_URL" -f migrations/006_medication_dose_reminders.sql

CREATE TABLE IF NOT EXISTS public.medication_dose_schedules (
  medication_id UUID PRIMARY KEY REFERENCES public.medications(id) ON DELETE CASCADE,
  interval_minutes INTEGER NOT NULL CHECK (interval_minutes > 0),
  reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medication_dose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medication_dose_logs_med_taken
  ON public.medication_dose_logs (medication_id, taken_at DESC);
