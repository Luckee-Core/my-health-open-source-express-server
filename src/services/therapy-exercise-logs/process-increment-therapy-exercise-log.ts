import type { Pool } from 'pg';
import { incrementTherapyExerciseLog } from '../../data/therapy-exercise-logs';
import type {
  IncrementTherapyExerciseLogInput,
  TherapyExerciseLog,
} from '../../data/therapy-exercise-logs';
import { parseLogDate } from '../../utils/therapy-exercise-logs';
import { assertTherapyExerciseExists } from '../../utils/therapy-exercises';

/**
 * Increments today's (or specified date's) therapy exercise log.
 */
export const processIncrementTherapyExerciseLog = async (
  pool: Pool,
  input: IncrementTherapyExerciseLogInput,
): Promise<TherapyExerciseLog> => {
  if (!input.exercise_id?.trim()) throw new Error('exercise_id is required');
  if (!input.log_date?.trim()) throw new Error('log_date is required');
  if (!Number.isFinite(input.delta) || input.delta === 0) {
    throw new Error('delta must be a non-zero number');
  }

  const logDate = parseLogDate(input.log_date);
  await assertTherapyExerciseExists(pool, input.exercise_id);

  return incrementTherapyExerciseLog(pool, input.exercise_id, logDate, input.delta);
};
