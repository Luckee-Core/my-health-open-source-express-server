import type { Pool } from 'pg';

/**
 * Validates that a hospital id exists.
 */
export const assertHospitalExists = async (
  pool: Pool,
  hospitalId: string,
): Promise<void> => {
  try {
    const result = await pool.query('SELECT id FROM hospitals WHERE id = $1', [hospitalId]);
    if (result.rowCount === 0) {
      throw new Error('hospital not found');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'hospital not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate hospital: ${message}`);
  }
};

/**
 * Validates that a specialty id exists.
 */
export const assertSpecialtyExists = async (
  pool: Pool,
  specialtyId: string,
): Promise<void> => {
  try {
    const result = await pool.query('SELECT id FROM specialties WHERE id = $1', [specialtyId]);
    if (result.rowCount === 0) {
      throw new Error('specialty not found');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'specialty not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate specialty: ${message}`);
  }
};
