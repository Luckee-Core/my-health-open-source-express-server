import type { Pool } from 'pg';
import type { Condition } from '../../model/condition';

/**
 * Loads all conditions.
 */
export const getAllConditions = async (pool: Pool): Promise<Condition[]> => {
  console.log('💾 getAllConditions');
  try {
    const result = await pool.query<Condition>(
      'SELECT * FROM conditions ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load conditions: ${message}`);
  }
};
