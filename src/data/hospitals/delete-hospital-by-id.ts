import type { Pool } from 'pg';

/**
 * Deletes a hospital by id.
 */
export const deleteHospitalById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteHospitalById');
  try {
    await pool.query('DELETE FROM hospitals WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete hospital: ${message}`);
  }
};
