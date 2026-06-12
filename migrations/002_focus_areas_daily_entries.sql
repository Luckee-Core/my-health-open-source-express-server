-- My Health — focus areas and daily entries
-- Apply with psql: psql "$DATABASE_URL" -f migrations/002_focus_areas_daily_entries.sql

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
