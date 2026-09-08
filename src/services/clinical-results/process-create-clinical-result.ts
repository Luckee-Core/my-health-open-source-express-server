import type { Pool } from 'pg';
import { createClinicalResult } from '../../data/clinical-results/create-clinical-result';
import type { CreateClinicalResultInput, ClinicalResult } from '../../model/clinical-result';

/**
 * Creates a ClinicalResult after light validation.
 */
export const processCreateClinicalResult = async (
  pool: Pool,
  input: CreateClinicalResultInput,
): Promise<ClinicalResult> => {
  return createClinicalResult(pool, input);
};
