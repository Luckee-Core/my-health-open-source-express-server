import type { Pool } from 'pg';
import type { TherapyExerciseLog } from './types';

type GetAllOptions = {
  log_date?: string;
};

/**
 * Loads therapy exercise logs, optionally filtered by log_date.
 */
export const getAllTherapyExerciseLogs = async (
  pool: Pool,
  options: GetAllOptions = {},
): Promise<TherapyExerciseLog[]> => {
  if (options.log_date) {
    const result = await pool.query<TherapyExerciseLog>(
      `SELECT * FROM therapy_exercise_logs
       WHERE log_date = $1
       ORDER BY log_date DESC, created_at DESC`,
      [options.log_date],
    );
    return result.rows;
  }

  const result = await pool.query<TherapyExerciseLog>(
    `SELECT * FROM therapy_exercise_logs
     ORDER BY log_date DESC, created_at DESC`,
  );
  return result.rows;
};
