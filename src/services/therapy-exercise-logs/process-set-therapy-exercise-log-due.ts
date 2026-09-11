import type { Pool } from 'pg';
import { setTherapyExerciseLogDue } from '../../data/therapy-exercise-logs';
import type {
  SetTherapyExerciseLogDueInput,
  TherapyExerciseLog,
} from '../../model/therapy-exercise-log';
import { parseLogDate } from '../../utils/therapy-exercise-logs';
import { assertTherapyExerciseExists } from '../../utils/therapy-exercises';

/**
 * Marks or unmarks a therapy exercise as due today (or a given date).
 */
export const processSetTherapyExerciseLogDue = async (
  pool: Pool,
  input: SetTherapyExerciseLogDueInput,
): Promise<TherapyExerciseLog> => {
  if (!input.exercise_id?.trim()) throw new Error('exercise_id is required');
  if (!input.log_date?.trim()) throw new Error('log_date is required');
  if (typeof input.due !== 'boolean') throw new Error('due must be a boolean');

  const logDate = parseLogDate(input.log_date);
  await assertTherapyExerciseExists(pool, input.exercise_id);

  return setTherapyExerciseLogDue(pool, input.exercise_id, logDate, input.due);
};
