import type { Pool } from 'pg';
import { createAllergy } from '../../data/allergies/create-allergy';
import type { CreateAllergyInput, Allergy } from '../../data/allergies/types';

/**
 * Creates a Allergy after light validation.
 */
export const processCreateAllergy = async (
  pool: Pool,
  input: CreateAllergyInput,
): Promise<Allergy> => {
  return createAllergy(pool, input);
};
