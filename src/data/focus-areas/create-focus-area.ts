import type { Pool } from 'pg';
import type { CreateFocusAreaInput, FocusArea } from './types';

/**
 * Creates a focus area record.
 */
export const createFocusArea = async (
  pool: Pool,
  input: CreateFocusAreaInput,
): Promise<FocusArea> => {
  console.log('💾 createFocusArea');
  try {
    const result = await pool.query<FocusArea>(
      `INSERT INTO focus_areas (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [input.name, input.description ?? null],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create focus area: ${message}`);
  }
};
