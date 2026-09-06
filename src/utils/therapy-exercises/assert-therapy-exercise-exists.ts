import type { Pool } from 'pg';
import { getTherapyExerciseById } from '../../data/therapy-exercises';

/**
 * Asserts a therapy exercise exists.
 */
export const assertTherapyExerciseExists = async (
  pool: Pool,
  exerciseId: string,
): Promise<void> => {
  const row = await getTherapyExerciseById(pool, exerciseId);
  if (!row) {
    throw new Error('Therapy exercise not found');
  }
};
