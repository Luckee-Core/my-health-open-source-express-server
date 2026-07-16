import type { Pool, PoolClient } from 'pg';
import type { CreateClinicalResultInput, ClinicalResult } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a ClinicalResult by (source_system, source_entry_key).
 */
export const upsertClinicalResultBySourceKey = async (
  pool: Queryable,
  input: CreateClinicalResultInput,
): Promise<ClinicalResult> => {
  console.log('💾 upsertClinicalResultBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<ClinicalResult>(
      `INSERT INTO clinical_results (observed_at, name, value_text, unit, interpretation, category, appointment_id, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         observed_at = EXCLUDED.observed_at,
         name = EXCLUDED.name,
         value_text = EXCLUDED.value_text,
         unit = EXCLUDED.unit,
         interpretation = EXCLUDED.interpretation,
         category = EXCLUDED.category,
         appointment_id = EXCLUDED.appointment_id,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
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
    throw new Error(`Failed to upsert ClinicalResult: ${message}`);
  }
};
