import type { Pool, PoolClient } from 'pg';
import type { CreateAllergyInput, Allergy } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a Allergy by (source_system, source_entry_key).
 */
export const upsertAllergyBySourceKey = async (
  pool: Queryable,
  input: CreateAllergyInput,
): Promise<Allergy> => {
  console.log('💾 upsertAllergyBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Allergy>(
      `INSERT INTO allergies (substance, reaction, criticality, status, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         substance = EXCLUDED.substance,
         reaction = EXCLUDED.reaction,
         criticality = EXCLUDED.criticality,
         status = EXCLUDED.status,
         notes = EXCLUDED.notes,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.substance,
        input.reaction ?? null,
        input.criticality ?? null,
        input.status ?? 'active',
        input.notes ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Allergy: ${message}`);
  }
};
