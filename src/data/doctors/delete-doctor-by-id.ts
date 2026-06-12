import type { Pool } from 'pg';

/**
 * Deletes a doctor by id.
 */
export const deleteDoctorById = async (pool: Pool, id: string): Promise<void> => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete doctor: ${message}`);
  }
};
