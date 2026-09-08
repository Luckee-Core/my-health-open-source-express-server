-- My Health — one-time tube feed starting snapshot
-- Apply with psql: psql "$DATABASE_URL" -f migrations/010_feed_log_is_start.sql

ALTER TABLE public.feed_logs
  ADD COLUMN IF NOT EXISTS is_start BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_logs_one_start
  ON public.feed_logs (is_start)
  WHERE is_start = true;
