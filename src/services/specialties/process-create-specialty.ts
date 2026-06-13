import type { Pool } from 'pg';
import { createSpecialty } from '../../data/specialties/create-specialty';
import type { CreateSpecialtyInput, Specialty } from '../../data/specialties/types';

/**
 * Creates a specialty after validating input.
 */
export const processCreateSpecialty = async (
  pool: Pool,
  input: CreateSpecialtyInput,
): Promise<Specialty> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  return createSpecialty(pool, { name });
};
