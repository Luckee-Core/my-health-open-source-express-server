import type { Pool, PoolClient } from 'pg';
import type { CreateConditionInput, Condition } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a Condition by (source_system, source_entry_key).
 */
export const upsertConditionBySourceKey = async (
  pool: Queryable,
  input: CreateConditionInput,
): Promise<Condition> => {
  console.log('💾 upsertConditionBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Condition>(
      `INSERT INTO conditions (name, status, noted_on, diagnosed_on, focus_area_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         name = EXCLUDED.name,
         status = EXCLUDED.status,
         noted_on = EXCLUDED.noted_on,
         diagnosed_on = EXCLUDED.diagnosed_on,
         focus_area_id = EXCLUDED.focus_area_id,
         notes = EXCLUDED.notes,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.name,
        input.status ?? 'active',
        input.noted_on ?? null,
        input.diagnosed_on ?? null,
        input.focus_area_id ?? null,
        input.notes ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Condition: ${message}`);
  }
};
