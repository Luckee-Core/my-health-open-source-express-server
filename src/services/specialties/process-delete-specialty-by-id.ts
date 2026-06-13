import type { Pool } from 'pg';
import { deleteSpecialtyById } from '../../data/specialties/delete-specialty-by-id';

/**
 * Deletes a specialty by id.
 */
export const processDeleteSpecialtyById = async (pool: Pool, id: string): Promise<void> => {
  await deleteSpecialtyById(pool, id);
};
