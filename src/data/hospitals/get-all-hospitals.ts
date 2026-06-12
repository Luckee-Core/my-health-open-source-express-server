import type { Pool } from 'pg';
import type { Hospital } from './types';

/**
 * Loads all hospitals ordered by name.
 */
export const getAllHospitals = async (pool: Pool): Promise<Hospital[]> => {
  try {
    const result = await pool.query<Hospital>(
      'SELECT * FROM hospitals ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load hospitals: ${message}`);
  }
};
