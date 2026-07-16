import type { Pool } from 'pg';
import { getAllInsuranceCoverages } from '../../data/insurance-coverages/get-all-insurance-coverages';
import type { InsuranceCoverage } from '../../data/insurance-coverages/types';

/**
 * Lists all insurance-coverages.
 */
export const processListInsuranceCoverages = async (pool: Pool): Promise<InsuranceCoverage[]> => {
  return getAllInsuranceCoverages(pool);
};
