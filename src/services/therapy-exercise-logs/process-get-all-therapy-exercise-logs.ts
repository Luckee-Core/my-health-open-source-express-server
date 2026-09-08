import type { Pool } from 'pg';
import { getAllTherapyExerciseLogs } from '../../data/therapy-exercise-logs';
import type { TherapyExerciseLog } from '../../model/therapy-exercise-log';
import { parseLogDate } from '../../utils/therapy-exercise-logs';

type GetAllOptions = {
  log_date?: string;
};

/**
 * Loads therapy exercise logs, optionally filtered by log_date.
 */
export const processGetAllTherapyExerciseLogs = async (
  pool: Pool,
  options: GetAllOptions = {},
): Promise<TherapyExerciseLog[]> => {
  const parsed: GetAllOptions = {};
  if (options.log_date) {
    parsed.log_date = parseLogDate(options.log_date);
  }
  return getAllTherapyExerciseLogs(pool, parsed);
};
