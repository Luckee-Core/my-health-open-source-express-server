import type { Pool } from 'pg';

/**
 * Deletes a ClinicalResult by id.
 */
export const deleteClinicalResultById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteClinicalResultById');
  try {
    await pool.query('DELETE FROM clinical_results WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete ClinicalResult: ${message}`);
  }
};
