import type { Pool } from 'pg';

/**
 * Deletes a ClinicalNote by id.
 */
export const deleteClinicalNoteById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteClinicalNoteById');
  try {
    await pool.query('DELETE FROM clinical_notes WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete ClinicalNote: ${message}`);
  }
};
