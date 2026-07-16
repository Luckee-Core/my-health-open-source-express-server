import type { Pool } from 'pg';
import type { ClinicalNote } from './types';

/**
 * Loads all clinical-notes.
 */
export const getAllClinicalNotes = async (pool: Pool): Promise<ClinicalNote[]> => {
  console.log('💾 getAllClinicalNotes');
  try {
    const result = await pool.query<ClinicalNote>(
      'SELECT * FROM clinical_notes ORDER BY note_at DESC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load clinical-notes: ${message}`);
  }
};
