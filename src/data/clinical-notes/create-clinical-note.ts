import type { Pool, PoolClient } from 'pg';
import type { CreateClinicalNoteInput, ClinicalNote } from './types';

type Queryable = Pool | PoolClient;

/**
 * Creates a ClinicalNote record.
 */
export const createClinicalNote = async (
  pool: Queryable,
  input: CreateClinicalNoteInput,
): Promise<ClinicalNote> => {
  console.log('💾 createClinicalNote');
  try {
    const result = await pool.query<ClinicalNote>(
      `INSERT INTO clinical_notes (note_at, title, author_name, body, appointment_id, doctor_id, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        input.note_at,
        input.title,
        input.author_name ?? null,
        input.body,
        input.appointment_id ?? null,
        input.doctor_id ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create ClinicalNote: ${message}`);
  }
};
