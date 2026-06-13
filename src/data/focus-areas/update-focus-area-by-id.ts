import type { Pool } from 'pg';
import type { FocusArea, UpdateFocusAreaInput } from './types';

/**
 * Updates a focus area by id.
 */
export const updateFocusAreaById = async (
  pool: Pool,
  id: string,
  input: UpdateFocusAreaInput,
): Promise<FocusArea> => {
  console.log('💾 updateFocusAreaById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name);
  }
  if (input.description !== undefined) {
    sets.push(`description = $${param++}`);
    values.push(input.description);
  }

  values.push(id);

  try {
    const result = await pool.query<FocusArea>(
      `UPDATE focus_areas SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('focus area not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'focus area not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update focus area: ${message}`);
  }
};
