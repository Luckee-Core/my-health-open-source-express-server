import type { Pool } from 'pg';
import type { Allergy } from '../../model/allergy';

/**
 * Loads all allergies.
 */
export const getAllAllergies = async (pool: Pool): Promise<Allergy[]> => {
  console.log('💾 getAllAllergies');
  try {
    const result = await pool.query<Allergy>(
      'SELECT * FROM allergies ORDER BY substance ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load allergies: ${message}`);
  }
};
