import type { Pool, PoolClient } from 'pg';
import type { TherapyExerciseLog } from '../../model/therapy-exercise-log';

type Db = Pool | PoolClient;

/**
 * Marks or unmarks a therapy exercise as due for a given date (session-only today list).
 */
export const setTherapyExerciseLogDue = async (
  db: Db,
  exerciseId: string,
  logDate: string,
  due: boolean,
): Promise<TherapyExerciseLog> => {
  console.log('💾 setTherapyExerciseLogDue');
  const result = await db.query<TherapyExerciseLog>(
    `INSERT INTO therapy_exercise_logs (exercise_id, log_date, completed_count, skipped, due)
     VALUES ($1, $2, 0, false, $3)
     ON CONFLICT (exercise_id, log_date)
     DO UPDATE SET
       due = $3,
       skipped = CASE WHEN $3 THEN false ELSE therapy_exercise_logs.skipped END,
       updated_at = now()
     RETURNING *`,
    [exerciseId, logDate, due],
  );
  return result.rows[0];
};
