import type { Pool, PoolClient } from 'pg';
import type { TherapyExerciseLog } from '../../model/therapy-exercise-log';

type Db = Pool | PoolClient;

/**
 * Increments or creates a therapy exercise log for a given exercise and date.
 */
export const incrementTherapyExerciseLog = async (
  db: Db,
  exerciseId: string,
  logDate: string,
  delta: number,
): Promise<TherapyExerciseLog> => {
  console.log('💾 incrementTherapyExerciseLog');
  const result = await db.query<TherapyExerciseLog>(
    `INSERT INTO therapy_exercise_logs (exercise_id, log_date, completed_count, skipped)
     VALUES ($1, $2, GREATEST(0, $3), false)
     ON CONFLICT (exercise_id, log_date)
     DO UPDATE SET
       completed_count = GREATEST(0, therapy_exercise_logs.completed_count + $3),
       skipped = false,
       updated_at = now()
     RETURNING *`,
    [exerciseId, logDate, delta],
  );
  return result.rows[0];
};
