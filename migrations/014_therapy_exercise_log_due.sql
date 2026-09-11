-- Mark a session-only exercise as due today so it appears on the daily list.
-- Does not change therapy_exercises.frequency or is_active.

ALTER TABLE public.therapy_exercise_logs
  ADD COLUMN IF NOT EXISTS due BOOLEAN NOT NULL DEFAULT false;
