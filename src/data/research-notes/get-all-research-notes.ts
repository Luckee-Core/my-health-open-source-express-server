import type { Pool } from 'pg';
import type { ResearchNote } from './types';

/**
 * Loads all research notes ordered by created_at descending.
 */
export const getAllResearchNotes = async (pool: Pool): Promise<ResearchNote[]> => {
  console.log('💾 getAllResearchNotes');
  try {
    const result = await pool.query<ResearchNote>(
      `SELECT * FROM research_notes
       ORDER BY created_at DESC`,
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load research notes: ${message}`);
  }
};
