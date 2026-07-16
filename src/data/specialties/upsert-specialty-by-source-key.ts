import type { Pool, PoolClient } from 'pg';
import type { CreateSpecialtyInput, Specialty } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a specialty by (source_system, source_entry_key), or attaches provenance
 * to an existing row matched by lower(name) when that row has no source key yet.
 */
export const upsertSpecialtyBySourceKey = async (
  pool: Queryable,
  input: CreateSpecialtyInput,
): Promise<Specialty> => {
  console.log('💾 upsertSpecialtyBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const byKey = await pool.query<Specialty>(
      `UPDATE specialties SET
         name = $1,
         source_document_id = $2,
         updated_at = now()
       WHERE source_system = $3 AND source_entry_key = $4
       RETURNING *`,
      [input.name, input.source_document_id ?? null, input.source_system, input.source_entry_key],
    );
    if (byKey.rows[0]) return byKey.rows[0];

    const byName = await pool.query<Specialty>(
      `UPDATE specialties SET
         source_system = $2,
         source_document_id = $3,
         source_entry_key = $4,
         updated_at = now()
       WHERE lower(trim(name)) = lower(trim($1))
         AND (source_entry_key IS NULL OR source_system IS NULL)
       RETURNING *`,
      [
        input.name,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    if (byName.rows[0]) return byName.rows[0];

    const inserted = await pool.query<Specialty>(
      `INSERT INTO specialties (name, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        input.name,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return inserted.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Specialty: ${message}`);
  }
};
