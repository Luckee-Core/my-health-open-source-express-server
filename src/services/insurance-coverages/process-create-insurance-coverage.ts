import type { Pool } from 'pg';
import { createInsuranceCoverage } from '../../data/insurance-coverages/create-insurance-coverage';
import type { CreateInsuranceCoverageInput, InsuranceCoverage } from '../../data/insurance-coverages/types';

/**
 * Creates a InsuranceCoverage after light validation.
 */
export const processCreateInsuranceCoverage = async (
  pool: Pool,
  input: CreateInsuranceCoverageInput,
): Promise<InsuranceCoverage> => {
  return createInsuranceCoverage(pool, input);
};
