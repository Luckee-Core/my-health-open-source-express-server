import type { Pool, PoolClient } from 'pg';
import type { CreateClinicalNoteInput, ClinicalNote } from '../../model/clinical-note';

type Queryable = Pool | PoolClient;

/**
 * Upserts a ClinicalNote by (source_system, source_entry_key).
 */
export const upsertClinicalNoteBySourceKey = async (
  pool: Queryable,
  input: CreateClinicalNoteInput,
): Promise<ClinicalNote> => {
  console.log('💾 upsertClinicalNoteBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<ClinicalNote>(
      `INSERT INTO clinical_notes (note_at, title, author_name, body, appointment_id, doctor_id, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         note_at = EXCLUDED.note_at,
         title = EXCLUDED.title,
         author_name = EXCLUDED.author_name,
         body = EXCLUDED.body,
         appointment_id = EXCLUDED.appointment_id,
         doctor_id = EXCLUDED.doctor_id,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
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
    throw new Error(`Failed to upsert ClinicalNote: ${message}`);
  }
};
