import type { Pool } from 'pg';
import type { FocusArea } from './types';

/**
 * Loads all focus areas ordered by name ascending.
 */
export const getAllFocusAreas = async (pool: Pool): Promise<FocusArea[]> => {
  console.log('💾 getAllFocusAreas');
  try {
    const result = await pool.query<FocusArea>(
      'SELECT * FROM focus_areas ORDER BY name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load focus areas: ${message}`);
  }
};
