import type { Pool } from 'pg';
import type { Specialty } from './types';

/**
 * Loads all specialties ordered by name.
 */
export const getAllSpecialties = async (pool: Pool): Promise<Specialty[]> => {
  console.log('💾 getAllSpecialties');
  try {
    const result = await pool.query<Specialty>(
      'SELECT * FROM specialties ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load specialties: ${message}`);
  }
};
