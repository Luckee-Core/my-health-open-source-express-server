import type { Pool, PoolClient } from 'pg';
import type { CreateClinicalResultInput, ClinicalResult } from '../../model/clinical-result';

type Queryable = Pool | PoolClient;

/**
 * Creates a ClinicalResult record.
 */
export const createClinicalResult = async (
  pool: Queryable,
  input: CreateClinicalResultInput,
): Promise<ClinicalResult> => {
  console.log('💾 createClinicalResult');
  try {
    const result = await pool.query<ClinicalResult>(
      `INSERT INTO clinical_results (observed_at, name, value_text, unit, interpretation, category, appointment_id, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        input.observed_at ?? null,
        input.name,
        input.value_text ?? null,
        input.unit ?? null,
        input.interpretation ?? null,
        input.category ?? 'other',
        input.appointment_id ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create ClinicalResult: ${message}`);
  }
};
