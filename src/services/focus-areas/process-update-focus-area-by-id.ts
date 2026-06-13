import type { Pool } from 'pg';
import { updateFocusAreaById } from '../../data/focus-areas/update-focus-area-by-id';
import type { FocusArea, UpdateFocusAreaInput } from '../../data/focus-areas/types';
import { isUniqueViolation } from '../../utils/postgres';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a focus area by id after validating input.
 */
export const processUpdateFocusAreaById = async (
  pool: Pool,
  id: string,
  input: UpdateFocusAreaInput,
): Promise<FocusArea> => {
  const normalized: UpdateFocusAreaInput = { ...input };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    normalized.name = name;
  }
  if (input.description !== undefined) {
    normalized.description = optionalText(input.description);
  }

  try {
    return await updateFocusAreaById(pool, id, normalized);
  } catch (error) {
    if (isUniqueViolation(error, 'idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    throw error;
  }
};
