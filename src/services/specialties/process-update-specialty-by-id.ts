import type { Pool } from 'pg';
import { updateSpecialtyById } from '../../data/specialties/update-specialty-by-id';
import type { Specialty, UpdateSpecialtyInput } from '../../data/specialties/types';

/**
 * Updates a specialty by id after validating input.
 */
export const processUpdateSpecialtyById = async (
  pool: Pool,
  id: string,
  input: UpdateSpecialtyInput,
): Promise<Specialty> => {
  const normalized: UpdateSpecialtyInput = { ...input };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    normalized.name = name;
  }

  return updateSpecialtyById(pool, id, normalized);
};
