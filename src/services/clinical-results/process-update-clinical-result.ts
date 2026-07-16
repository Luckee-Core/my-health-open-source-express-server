import type { Pool } from 'pg';
import { updateClinicalResultById } from '../../data/clinical-results/update-clinical-result-by-id';
import type { ClinicalResult, UpdateClinicalResultInput } from '../../data/clinical-results/types';

/**
 * Updates a ClinicalResult by id.
 */
export const processUpdateClinicalResult = async (
  pool: Pool,
  id: string,
  input: UpdateClinicalResultInput,
): Promise<ClinicalResult> => {
  return updateClinicalResultById(pool, id, input);
};
