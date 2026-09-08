import type { Pool } from 'pg';
import type { ClinicalResult } from '../../model/clinical-result';

/**
 * Loads all clinical-results.
 */
export const getAllClinicalResults = async (pool: Pool): Promise<ClinicalResult[]> => {
  console.log('💾 getAllClinicalResults');
  try {
    const result = await pool.query<ClinicalResult>(
      'SELECT * FROM clinical_results ORDER BY observed_at DESC NULLS LAST',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load clinical-results: ${message}`);
  }
};
