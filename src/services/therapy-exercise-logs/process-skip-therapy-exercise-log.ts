import type { Pool } from 'pg';
import { setTherapyExerciseLogSkipped } from '../../data/therapy-exercise-logs';
import type {
  SkipTherapyExerciseLogInput,
  TherapyExerciseLog,
} from '../../model/therapy-exercise-log';
import { parseLogDate } from '../../utils/therapy-exercise-logs';
import { assertTherapyExerciseExists } from '../../utils/therapy-exercises';

/**
 * Marks or unmarks a therapy exercise as skipped for today (or a given date).
 */
export const processSkipTherapyExerciseLog = async (
  pool: Pool,
  input: SkipTherapyExerciseLogInput,
): Promise<TherapyExerciseLog> => {
  if (!input.exercise_id?.trim()) throw new Error('exercise_id is required');
  if (!input.log_date?.trim()) throw new Error('log_date is required');
  if (typeof input.skipped !== 'boolean') throw new Error('skipped must be a boolean');

  const logDate = parseLogDate(input.log_date);
  await assertTherapyExerciseExists(pool, input.exercise_id);

  return setTherapyExerciseLogSkipped(pool, input.exercise_id, logDate, input.skipped);
};
