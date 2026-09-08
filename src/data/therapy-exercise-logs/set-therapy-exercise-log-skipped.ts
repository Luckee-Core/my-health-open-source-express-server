import type { Pool, PoolClient } from 'pg';
import type { TherapyExerciseLog } from '../../model/therapy-exercise-log';

type Db = Pool | PoolClient;

/**
 * Marks or unmarks a therapy exercise as skipped for a given date.
 */
export const setTherapyExerciseLogSkipped = async (
  db: Db,
  exerciseId: string,
  logDate: string,
  skipped: boolean,
): Promise<TherapyExerciseLog> => {
  console.log('💾 setTherapyExerciseLogSkipped');
  const result = await db.query<TherapyExerciseLog>(
    `INSERT INTO therapy_exercise_logs (exercise_id, log_date, completed_count, skipped)
     VALUES ($1, $2, 0, $3)
     ON CONFLICT (exercise_id, log_date)
     DO UPDATE SET
       skipped = $3,
       updated_at = now()
     RETURNING *`,
    [exerciseId, logDate, skipped],
  );
  return result.rows[0];
};
