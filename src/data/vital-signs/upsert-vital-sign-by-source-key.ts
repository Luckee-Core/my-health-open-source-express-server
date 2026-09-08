import type { Pool, PoolClient } from 'pg';
import type { CreateVitalSignInput, VitalSign } from '../../model/vital-sign';

type Queryable = Pool | PoolClient;

/**
 * Upserts a VitalSign by (source_system, source_entry_key).
 */
export const upsertVitalSignBySourceKey = async (
  pool: Queryable,
  input: CreateVitalSignInput,
): Promise<VitalSign> => {
  console.log('💾 upsertVitalSignBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<VitalSign>(
      `INSERT INTO vital_signs (recorded_at, metric, value_text, numeric_value, unit, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         recorded_at = EXCLUDED.recorded_at,
         metric = EXCLUDED.metric,
         value_text = EXCLUDED.value_text,
         numeric_value = EXCLUDED.numeric_value,
         unit = EXCLUDED.unit,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.recorded_at,
        input.metric,
        input.value_text,
        input.numeric_value ?? null,
        input.unit ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert VitalSign: ${message}`);
  }
};
