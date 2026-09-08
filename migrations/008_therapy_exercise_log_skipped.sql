-- Skip an exercise for today only (e.g. waiting on nurse help).
-- Does not change therapy_exercises.is_active.

ALTER TABLE public.therapy_exercise_logs
  ADD COLUMN IF NOT EXISTS skipped BOOLEAN NOT NULL DEFAULT false;
