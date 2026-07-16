import type { Pool } from 'pg';
import { getAllAllergies } from '../../data/allergies/get-all-allergies';
import type { Allergy } from '../../data/allergies/types';

/**
 * Lists all allergies.
 */
export const processListAllergies = async (pool: Pool): Promise<Allergy[]> => {
  return getAllAllergies(pool);
};
