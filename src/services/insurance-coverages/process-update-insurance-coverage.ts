import type { Pool } from 'pg';
import { updateInsuranceCoverageById } from '../../data/insurance-coverages/update-insurance-coverage-by-id';
import type { InsuranceCoverage, UpdateInsuranceCoverageInput } from '../../model/insurance-coverage';

/**
 * Updates a InsuranceCoverage by id.
 */
export const processUpdateInsuranceCoverage = async (
  pool: Pool,
  id: string,
  input: UpdateInsuranceCoverageInput,
): Promise<InsuranceCoverage> => {
  return updateInsuranceCoverageById(pool, id, input);
};
