import type { Pool, PoolClient } from 'pg';
import type { CreateHospitalInput, Hospital } from '../../model/hospital';

type Queryable = Pool | PoolClient;

/**
 * Upserts a hospital by (source_system, source_entry_key), or attaches provenance
 * to an existing row matched by lower(name) when that row has no source key yet.
 */
export const upsertHospitalBySourceKey = async (
  pool: Queryable,
  input: CreateHospitalInput,
): Promise<Hospital> => {
  console.log('💾 upsertHospitalBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const byKey = await pool.query<Hospital>(
      `UPDATE hospitals SET
         name = $1,
         address = COALESCE($2, address),
         phone = COALESCE($3, phone),
         notes = COALESCE($4, notes),
         source_document_id = $5,
         updated_at = now()
       WHERE source_system = $6 AND source_entry_key = $7
       RETURNING *`,
      [
        input.name,
        input.address ?? null,
        input.phone ?? null,
        input.notes ?? null,
        input.source_document_id ?? null,
        input.source_system,
        input.source_entry_key,
      ],
    );
    if (byKey.rows[0]) return byKey.rows[0];

    const byName = await pool.query<Hospital>(
      `UPDATE hospitals SET
         address = COALESCE($2, address),
         phone = COALESCE($3, phone),
         notes = COALESCE($4, notes),
         source_system = $5,
         source_document_id = $6,
         source_entry_key = $7,
         updated_at = now()
       WHERE lower(trim(name)) = lower(trim($1))
         AND (source_entry_key IS NULL OR source_system IS NULL)
       RETURNING *`,
      [
        input.name,
        input.address ?? null,
        input.phone ?? null,
        input.notes ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    if (byName.rows[0]) return byName.rows[0];

    const inserted = await pool.query<Hospital>(
      `INSERT INTO hospitals (
         name, address, email, phone, notes,
         source_system, source_document_id, source_entry_key
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        input.name,
        input.address ?? null,
        input.email ?? null,
        input.phone ?? null,
        input.notes ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return inserted.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Hospital: ${message}`);
  }
};
