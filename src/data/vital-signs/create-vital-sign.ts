import type { Pool, PoolClient } from 'pg';
import type { CreateVitalSignInput, VitalSign } from '../../model/vital-sign';

type Queryable = Pool | PoolClient;

/**
 * Creates a VitalSign record.
 */
export const createVitalSign = async (
  pool: Queryable,
  input: CreateVitalSignInput,
): Promise<VitalSign> => {
  console.log('💾 createVitalSign');
  try {
    const result = await pool.query<VitalSign>(
      `INSERT INTO vital_signs (recorded_at, metric, value_text, numeric_value, unit, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    throw new Error(`Failed to create VitalSign: ${message}`);
  }
};
