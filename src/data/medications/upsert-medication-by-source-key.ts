import type { Pool, PoolClient } from 'pg';
import type { CreateMedicationInput, Medication } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a Medication by (source_system, source_entry_key).
 */
export const upsertMedicationBySourceKey = async (
  pool: Queryable,
  input: CreateMedicationInput,
): Promise<Medication> => {
  console.log('💾 upsertMedicationBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Medication>(
      `INSERT INTO medications (name, instructions, started_on, status, doctor_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         name = EXCLUDED.name,
         instructions = EXCLUDED.instructions,
         started_on = EXCLUDED.started_on,
         status = EXCLUDED.status,
         doctor_id = EXCLUDED.doctor_id,
         notes = EXCLUDED.notes,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.name,
        input.instructions ?? null,
        input.started_on ?? null,
        input.status ?? 'active',
        input.doctor_id ?? null,
        input.notes ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Medication: ${message}`);
  }
};
