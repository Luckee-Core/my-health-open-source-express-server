import type { Pool } from 'pg';
import { createFocusArea } from '../../data/focus-areas/create-focus-area';
import type { CreateFocusAreaInput, FocusArea } from '../../data/focus-areas/types';
import { isUniqueViolation } from '../../utils/postgres';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a focus area after validating input.
 */
export const processCreateFocusArea = async (
  pool: Pool,
  input: CreateFocusAreaInput,
): Promise<FocusArea> => {
  const name = input.name?.trim() ?? '';
  if (!name) throw new Error('name is required');

  try {
    return await createFocusArea(pool, {
      name,
      description: optionalText(input.description),
    });
  } catch (error) {
    if (isUniqueViolation(error, 'idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    throw error;
  }
};
