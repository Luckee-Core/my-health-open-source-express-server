import type { Pool, PoolClient } from 'pg';
import type { CreateConditionInput, Condition } from '../../model/condition';

type Queryable = Pool | PoolClient;

/**
 * Creates a Condition record.
 */
export const createCondition = async (
  pool: Queryable,
  input: CreateConditionInput,
): Promise<Condition> => {
  console.log('💾 createCondition');
  try {
    const result = await pool.query<Condition>(
      `INSERT INTO conditions (name, status, noted_on, diagnosed_on, focus_area_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
    throw new Error(`Failed to create Condition: ${message}`);
  }
};
