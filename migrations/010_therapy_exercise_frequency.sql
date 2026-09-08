-- Constrain therapy_exercises.frequency to daily homework vs therapy-session-only.
-- Session-only exercises stay loggable but are excluded from today's remaining list.

UPDATE public.therapy_exercises
SET frequency = 'daily'
WHERE frequency IS NULL OR frequency NOT IN ('daily', 'session');

ALTER TABLE public.therapy_exercises
  DROP CONSTRAINT IF EXISTS therapy_exercises_frequency_check;

ALTER TABLE public.therapy_exercises
  ADD CONSTRAINT therapy_exercises_frequency_check
  CHECK (frequency IN ('daily', 'session'));
