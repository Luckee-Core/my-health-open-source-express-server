import type { Pool } from 'pg';
import { getAllClinicalNotes } from '../../data/clinical-notes/get-all-clinical-notes';
import type { ClinicalNote } from '../../data/clinical-notes/types';

/**
 * Lists all clinical-notes.
 */
export const processListClinicalNotes = async (pool: Pool): Promise<ClinicalNote[]> => {
  return getAllClinicalNotes(pool);
};
