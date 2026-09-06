import type { Pool } from 'pg';
import type { TherapyExercise } from './types';

/**
 * Loads all therapy exercises ordered by sort_order then name.
 */
export const getAllTherapyExercises = async (pool: Pool): Promise<TherapyExercise[]> => {
  const result = await pool.query<TherapyExercise>(
    `SELECT * FROM therapy_exercises
     ORDER BY sort_order ASC, lower(name) ASC`,
  );
  return result.rows;
};
