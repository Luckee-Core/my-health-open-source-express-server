import type { Pool } from 'pg';

/**
 * Deletes a InsuranceCoverage by id.
 */
export const deleteInsuranceCoverageById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteInsuranceCoverageById');
  try {
    await pool.query('DELETE FROM insurance_coverages WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete InsuranceCoverage: ${message}`);
  }
};
