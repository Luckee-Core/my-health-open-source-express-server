import type { Pool, PoolClient } from 'pg';
import type { CreateSymptomLogInput, SymptomLog } from '../../model/symptom-log';

type Queryable = Pool | PoolClient;

/**
 * Upserts a symptom log by (source_system, source_entry_key).
 */
export const upsertSymptomLogBySourceKey = async (
  pool: Queryable,
  input: CreateSymptomLogInput,
): Promise<SymptomLog> => {
  console.log('💾 upsertSymptomLogBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<SymptomLog>(
      `INSERT INTO symptom_logs (
         recorded_at, name, severity, triggers, duration_minutes, notes, focus_area_id,
         source_system, source_document_id, source_entry_key
       ) VALUES (COALESCE($1::timestamptz, now()), $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         recorded_at = EXCLUDED.recorded_at,
         name = EXCLUDED.name,
         severity = EXCLUDED.severity,
         triggers = EXCLUDED.triggers,
         duration_minutes = EXCLUDED.duration_minutes,
         notes = EXCLUDED.notes,
         focus_area_id = EXCLUDED.focus_area_id,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.recorded_at ?? null,
        input.name,
        input.severity ?? null,
        input.triggers ?? null,
        input.duration_minutes ?? null,
        input.notes ?? null,
        input.focus_area_id ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert SymptomLog: ${message}`);
  }
};
