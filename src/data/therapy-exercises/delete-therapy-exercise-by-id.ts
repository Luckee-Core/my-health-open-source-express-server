import type { Pool } from 'pg';

/**
 * Deletes a therapy exercise by id.
 */
export const deleteTherapyExerciseById = async (pool: Pool, id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM therapy_exercises WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
