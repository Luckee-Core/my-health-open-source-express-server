import type { Pool } from 'pg';

/**
 * Deletes a focus area by id.
 */
export const deleteFocusAreaById = async (pool: Pool, id: string): Promise<void> => {
  try {
    await pool.query('DELETE FROM focus_areas WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete focus area: ${message}`);
  }
};
