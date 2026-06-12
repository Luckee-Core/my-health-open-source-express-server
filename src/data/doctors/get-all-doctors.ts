import type { Pool } from 'pg';
import type { Doctor } from './types';

/**
 * Loads all doctors ordered by name.
 */
export const getAllDoctors = async (pool: Pool): Promise<Doctor[]> => {
  try {
    const result = await pool.query<Doctor>(
      'SELECT * FROM doctors ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load doctors: ${message}`);
  }
};
