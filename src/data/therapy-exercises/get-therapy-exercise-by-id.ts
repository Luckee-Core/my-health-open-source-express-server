import type { Pool } from 'pg';
import type { TherapyExercise } from './types';

/**
 * Loads a therapy exercise by id.
 */
export const getTherapyExerciseById = async (
  pool: Pool,
  id: string,
): Promise<TherapyExercise | null> => {
  const result = await pool.query<TherapyExercise>(
    'SELECT * FROM therapy_exercises WHERE id = $1',
    [id],
  );
  return result.rows[0] ?? null;
};
