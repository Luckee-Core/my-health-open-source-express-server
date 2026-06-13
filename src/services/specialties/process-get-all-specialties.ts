import type { Pool } from 'pg';
import { getAllSpecialties } from '../../data/specialties/get-all-specialties';
import type { Specialty } from '../../data/specialties/types';

/**
 * Loads all specialties.
 */
export const processGetAllSpecialties = async (pool: Pool): Promise<Specialty[]> => {
  return getAllSpecialties(pool);
};
