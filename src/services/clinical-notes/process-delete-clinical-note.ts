import type { Pool } from 'pg';
import { deleteClinicalNoteById } from '../../data/clinical-notes/delete-clinical-note-by-id';

/**
 * Deletes a ClinicalNote by id.
 */
export const processDeleteClinicalNote = async (pool: Pool, id: string): Promise<void> => {
  await deleteClinicalNoteById(pool, id);
};
