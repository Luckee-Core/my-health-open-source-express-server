import type { Pool } from 'pg';
import { deleteAllergyById } from '../../data/allergies/delete-allergy-by-id';

/**
 * Deletes a Allergy by id.
 */
export const processDeleteAllergy = async (pool: Pool, id: string): Promise<void> => {
  await deleteAllergyById(pool, id);
};
