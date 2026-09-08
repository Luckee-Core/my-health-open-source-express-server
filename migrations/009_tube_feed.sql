-- My Health — tube feed formulas and daily pump snapshots
-- Apply with psql: psql "$DATABASE_URL" -f migrations/009_tube_feed.sql

CREATE TABLE IF NOT EXISTS public.feed_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  calories_per_1000_ml NUMERIC NOT NULL CHECK (calories_per_1000_ml > 0),
  container_volume_ml NUMERIC NOT NULL DEFAULT 1000 CHECK (container_volume_ml > 0),
  volume_fl_oz NUMERIC CHECK (volume_fl_oz IS NULL OR volume_fl_oz > 0),
  volume_qt NUMERIC CHECK (volume_qt IS NULL OR volume_qt > 0),
  volume_l NUMERIC CHECK (volume_l IS NULL OR volume_l > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_formulas_active_name
  ON public.feed_formulas (is_active, lower(brand), lower(name));

CREATE TABLE IF NOT EXISTS public.feed_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL,
  formula_id UUID NOT NULL REFERENCES public.feed_formulas(id) ON DELETE RESTRICT,
  intermittent_rate_ml_per_hr NUMERIC NOT NULL DEFAULT 50
    CHECK (intermittent_rate_ml_per_hr > 0),
  feed_left_ml NUMERIC NOT NULL CHECK (feed_left_ml >= 0),
  total_fed_ml NUMERIC NOT NULL CHECK (total_fed_ml >= 0),
  pump_reset BOOLEAN NOT NULL DEFAULT false,
  is_start BOOLEAN NOT NULL DEFAULT false,
  calories_per_1000_ml NUMERIC NOT NULL CHECK (calories_per_1000_ml > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_logs_log_date
  ON public.feed_logs (log_date);

CREATE INDEX IF NOT EXISTS idx_feed_logs_formula_id
  ON public.feed_logs (formula_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_logs_one_start
  ON public.feed_logs (is_start)
  WHERE is_start = true;
