import type { Pool } from 'pg';
import { updateAllergyById } from '../../data/allergies/update-allergy-by-id';
import type { Allergy, UpdateAllergyInput } from '../../model/allergy';

/**
 * Updates a Allergy by id.
 */
export const processUpdateAllergy = async (
  pool: Pool,
  id: string,
  input: UpdateAllergyInput,
): Promise<Allergy> => {
  return updateAllergyById(pool, id, input);
};
