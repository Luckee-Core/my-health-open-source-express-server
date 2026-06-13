import type { Pool } from 'pg';

/**
 * Validates that a doctor id exists.
 */
export const assertDoctorExists = async (
  pool: Pool,
  doctorId: string,
): Promise<void> => {
  try {
    const result = await pool.query('SELECT id FROM doctors WHERE id = $1', [doctorId]);
    if (result.rowCount === 0) {
      throw new Error('doctor not found');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'doctor not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate doctor: ${message}`);
  }
};
