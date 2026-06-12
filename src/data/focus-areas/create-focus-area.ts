import type { Pool } from 'pg';
import { isUniqueViolation } from '../../utils/postgres';
import type { CreateFocusAreaInput, FocusArea } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a focus area record.
 */
export const createFocusArea = async (
  pool: Pool,
  input: CreateFocusAreaInput,
): Promise<FocusArea> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  try {
    const result = await pool.query<FocusArea>(
      `INSERT INTO focus_areas (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, optionalText(input.description)],
    );
    return result.rows[0];
  } catch (error) {
    if (isUniqueViolation(error, 'idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create focus area: ${message}`);
  }
};
