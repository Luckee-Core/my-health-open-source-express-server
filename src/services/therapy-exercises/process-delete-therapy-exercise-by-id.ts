import type { Pool } from 'pg';
import { deleteTherapyExerciseById } from '../../data/therapy-exercises';

/**
 * Deletes a therapy exercise by id.
 */
export const processDeleteTherapyExerciseById = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  const deleted = await deleteTherapyExerciseById(pool, id);
  if (!deleted) {
    throw new Error('Therapy exercise not found');
  }
};
