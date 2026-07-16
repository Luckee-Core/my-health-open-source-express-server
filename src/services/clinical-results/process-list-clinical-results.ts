import type { Pool } from 'pg';
import { getAllClinicalResults } from '../../data/clinical-results/get-all-clinical-results';
import type { ClinicalResult } from '../../data/clinical-results/types';

/**
 * Lists all clinical-results.
 */
export const processListClinicalResults = async (pool: Pool): Promise<ClinicalResult[]> => {
  return getAllClinicalResults(pool);
};
