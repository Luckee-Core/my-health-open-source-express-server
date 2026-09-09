-- My Health — morning snapshots are separate from the one-time start row
-- Apply with psql: psql "$DATABASE_URL" -f migrations/012_feed_logs_morning_per_date.sql

DROP INDEX IF EXISTS idx_feed_logs_log_date;

CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_logs_one_morning_per_date
  ON public.feed_logs (log_date)
  WHERE is_start = false;
