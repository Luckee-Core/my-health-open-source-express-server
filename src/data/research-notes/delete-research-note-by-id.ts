import type { Pool } from 'pg';

/**
 * Deletes a research note by id.
 */
export const deleteResearchNoteById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteResearchNoteById');
  try {
    await pool.query('DELETE FROM research_notes WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete research note: ${message}`);
  }
};
