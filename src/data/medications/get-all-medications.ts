import type { Pool } from 'pg';
import type { Medication } from './types';

/**
 * Loads all medications.
 */
export const getAllMedications = async (pool: Pool): Promise<Medication[]> => {
  console.log('💾 getAllMedications');
  try {
    const result = await pool.query<Medication>(
      'SELECT * FROM medications ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load medications: ${message}`);
  }
};
