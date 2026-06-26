import type { Pool } from 'pg';
import { getAllResearchNotes } from '../../data/research-notes/get-all-research-notes';
import type { ResearchNote } from '../../data/research-notes/types';

/**
 * Loads all research notes.
 */
export const processGetAllResearchNotes = async (pool: Pool): Promise<ResearchNote[]> =>
  getAllResearchNotes(pool);
