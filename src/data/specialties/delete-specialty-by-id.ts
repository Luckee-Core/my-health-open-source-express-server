import type { Pool } from 'pg';

/**
 * Deletes a specialty by id.
 */
export const deleteSpecialtyById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteSpecialtyById');
  try {
    await pool.query('DELETE FROM specialties WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete specialty: ${message}`);
  }
};
