import type { Pool } from 'pg';
import { deleteClinicalResultById } from '../../data/clinical-results/delete-clinical-result-by-id';

/**
 * Deletes a ClinicalResult by id.
 */
export const processDeleteClinicalResult = async (pool: Pool, id: string): Promise<void> => {
  await deleteClinicalResultById(pool, id);
};
