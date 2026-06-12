import type { Pool } from 'pg';

/**
 * Validates that a focus area id exists.
 */
export const assertFocusAreaExists = async (
  pool: Pool,
  focusAreaId: string,
): Promise<void> => {
  try {
    const result = await pool.query('SELECT id FROM focus_areas WHERE id = $1', [focusAreaId]);
    if (result.rowCount === 0) {
      throw new Error('focus area not found');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'focus area not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate focus area: ${message}`);
  }
};
