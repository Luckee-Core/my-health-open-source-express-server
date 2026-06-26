import type { Pool } from 'pg';
import { deleteResearchNoteById } from '../../data/research-notes/delete-research-note-by-id';

/**
 * Deletes a research note by id.
 */
export const processDeleteResearchNoteById = async (pool: Pool, id: string): Promise<void> => {
  await deleteResearchNoteById(pool, id);
};
