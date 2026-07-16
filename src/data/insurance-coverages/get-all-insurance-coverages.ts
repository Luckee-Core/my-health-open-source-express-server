import type { Pool } from 'pg';
import type { InsuranceCoverage } from './types';

/**
 * Loads all insurance-coverages.
 */
export const getAllInsuranceCoverages = async (pool: Pool): Promise<InsuranceCoverage[]> => {
  console.log('💾 getAllInsuranceCoverages');
  try {
    const result = await pool.query<InsuranceCoverage>(
      'SELECT * FROM insurance_coverages ORDER BY payer_name ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load insurance-coverages: ${message}`);
  }
};
