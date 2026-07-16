import type { Pool, PoolClient } from 'pg';
import type { CreateAllergyInput, Allergy } from './types';

type Queryable = Pool | PoolClient;

/**
 * Creates a Allergy record.
 */
export const createAllergy = async (
  pool: Queryable,
  input: CreateAllergyInput,
): Promise<Allergy> => {
  console.log('💾 createAllergy');
  try {
    const result = await pool.query<Allergy>(
      `INSERT INTO allergies (substance, reaction, criticality, status, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    throw new Error(`Failed to create Allergy: ${message}`);
  }
};
