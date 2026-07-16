import type { Pool } from 'pg';
import { deleteInsuranceCoverageById } from '../../data/insurance-coverages/delete-insurance-coverage-by-id';

/**
 * Deletes a InsuranceCoverage by id.
 */
export const processDeleteInsuranceCoverage = async (pool: Pool, id: string): Promise<void> => {
  await deleteInsuranceCoverageById(pool, id);
};
