import type { Pool } from 'pg';

/**
 * Deletes a Medication by id.
 */
export const deleteMedicationById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteMedicationById');
  try {
    await pool.query('DELETE FROM medications WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete Medication: ${message}`);
  }
};
