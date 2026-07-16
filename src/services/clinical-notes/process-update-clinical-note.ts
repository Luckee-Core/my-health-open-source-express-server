import type { Pool } from 'pg';
import { updateClinicalNoteById } from '../../data/clinical-notes/update-clinical-note-by-id';
import type { ClinicalNote, UpdateClinicalNoteInput } from '../../data/clinical-notes/types';

/**
 * Updates a ClinicalNote by id.
 */
export const processUpdateClinicalNote = async (
  pool: Pool,
  id: string,
  input: UpdateClinicalNoteInput,
): Promise<ClinicalNote> => {
  return updateClinicalNoteById(pool, id, input);
};
