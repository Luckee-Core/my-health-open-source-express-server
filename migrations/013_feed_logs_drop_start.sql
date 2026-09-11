-- My Health — drop one-time start snapshots; one pump log per calendar date
-- Apply with psql: psql "$DATABASE_URL" -f migrations/013_feed_logs_drop_start.sql

DELETE FROM public.feed_logs AS start_row
USING public.feed_logs AS morning_row
WHERE start_row.is_start = true
  AND morning_row.is_start = false
  AND start_row.log_date = morning_row.log_date;

UPDATE public.feed_logs
SET is_start = false
WHERE is_start = true;

DROP INDEX IF EXISTS idx_feed_logs_one_start;
DROP INDEX IF EXISTS idx_feed_logs_one_morning_per_date;

CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_logs_log_date
  ON public.feed_logs (log_date);
