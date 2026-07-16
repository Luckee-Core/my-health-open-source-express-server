import type { Pool } from 'pg';

/**
 * Deletes a VitalSign by id.
 */
export const deleteVitalSignById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteVitalSignById');
  try {
    await pool.query('DELETE FROM vital_signs WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete VitalSign: ${message}`);
  }
};
