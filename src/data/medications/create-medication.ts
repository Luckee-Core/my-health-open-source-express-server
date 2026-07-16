import type { Pool, PoolClient } from 'pg';
import type { CreateMedicationInput, Medication } from './types';

type Queryable = Pool | PoolClient;

/**
 * Creates a Medication record.
 */
export const createMedication = async (
  pool: Queryable,
  input: CreateMedicationInput,
): Promise<Medication> => {
  console.log('💾 createMedication');
  try {
    const result = await pool.query<Medication>(
      `INSERT INTO medications (name, instructions, started_on, status, doctor_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
    throw new Error(`Failed to create Medication: ${message}`);
  }
};
