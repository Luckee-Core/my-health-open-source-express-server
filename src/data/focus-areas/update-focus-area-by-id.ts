import type { Pool } from 'pg';
import { isUniqueViolation } from '../../utils/postgres';
import type { FocusArea, UpdateFocusAreaInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a focus area by id.
 */
export const updateFocusAreaById = async (
  pool: Pool,
  id: string,
  input: UpdateFocusAreaInput,
): Promise<FocusArea> => {
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    sets.push(`name = $${param++}`);
    values.push(name);
  }
  if (input.description !== undefined) {
    sets.push(`description = $${param++}`);
    values.push(optionalText(input.description));
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
    if (isUniqueViolation(error, 'idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update focus area: ${message}`);
  }
};
