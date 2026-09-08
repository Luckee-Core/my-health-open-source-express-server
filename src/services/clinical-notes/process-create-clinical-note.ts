import type { Pool } from 'pg';
import { createClinicalNote } from '../../data/clinical-notes/create-clinical-note';
import type { CreateClinicalNoteInput, ClinicalNote } from '../../model/clinical-note';

/**
 * Creates a ClinicalNote after light validation.
 */
export const processCreateClinicalNote = async (
  pool: Pool,
  input: CreateClinicalNoteInput,
): Promise<ClinicalNote> => {
  return createClinicalNote(pool, input);
};
