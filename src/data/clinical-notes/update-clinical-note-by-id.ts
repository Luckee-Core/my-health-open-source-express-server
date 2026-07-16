import type { Pool } from 'pg';
import type { ClinicalNote, UpdateClinicalNoteInput } from './types';

/**
 * Updates a ClinicalNote by id.
 */
export const updateClinicalNoteById = async (
  pool: Pool,
  id: string,
  input: UpdateClinicalNoteInput,
): Promise<ClinicalNote> => {
  console.log('💾 updateClinicalNoteById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.note_at !== undefined) {
    sets.push(`note_at = $${param++}`);
    values.push(input.note_at ?? null);
  }
  if (input.title !== undefined) {
    sets.push(`title = $${param++}`);
    values.push(input.title ?? null);
  }
  if (input.author_name !== undefined) {
    sets.push(`author_name = $${param++}`);
    values.push(input.author_name ?? null);
  }
  if (input.body !== undefined) {
    sets.push(`body = $${param++}`);
    values.push(input.body ?? null);
  }
  if (input.appointment_id !== undefined) {
    sets.push(`appointment_id = $${param++}`);
    values.push(input.appointment_id ?? null);
  }
  if (input.doctor_id !== undefined) {
    sets.push(`doctor_id = $${param++}`);
    values.push(input.doctor_id ?? null);
  }
  if (input.source_system !== undefined) {
    sets.push(`source_system = $${param++}`);
    values.push(input.source_system ?? null);
  }
  if (input.source_document_id !== undefined) {
    sets.push(`source_document_id = $${param++}`);
    values.push(input.source_document_id ?? null);
  }
  if (input.source_entry_key !== undefined) {
    sets.push(`source_entry_key = $${param++}`);
    values.push(input.source_entry_key ?? null);
  }

  values.push(id);

  try {
    const result = await pool.query<ClinicalNote>(
      `UPDATE clinical_notes SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('ClinicalNote not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'ClinicalNote not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update ClinicalNote: ${message}`);
  }
};
