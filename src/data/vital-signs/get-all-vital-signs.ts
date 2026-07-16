import type { Pool } from 'pg';
import type { VitalSign } from './types';

/**
 * Loads all vital-signs.
 */
export const getAllVitalSigns = async (pool: Pool): Promise<VitalSign[]> => {
  console.log('💾 getAllVitalSigns');
  try {
    const result = await pool.query<VitalSign>(
      'SELECT * FROM vital_signs ORDER BY recorded_at DESC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load vital-signs: ${message}`);
  }
};
