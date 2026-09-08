import type { Pool } from 'pg';
import type { CreateResearchNoteInput, ResearchNote } from '../../model/research-note';

/**
 * Creates a research note record.
 */
export const createResearchNote = async (
  pool: Pool,
  input: CreateResearchNoteInput,
): Promise<ResearchNote> => {
  console.log('💾 createResearchNote');
  try {
    const result = await pool.query<ResearchNote>(
      `INSERT INTO research_notes (
         title, category, source_url, summary, content, focus_area_id
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.title,
        input.category ?? 'other',
        input.source_url ?? null,
        input.summary ?? null,
        input.content ?? null,
        input.focus_area_id ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create research note: ${message}`);
  }
};
