import type { Pool } from 'pg';
import type { ResearchNote, UpdateResearchNoteInput } from '../../model/research-note';

/**
 * Updates a research note by id.
 */
export const updateResearchNoteById = async (
  pool: Pool,
  id: string,
  input: UpdateResearchNoteInput,
): Promise<ResearchNote> => {
  console.log('💾 updateResearchNoteById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.title !== undefined) {
    sets.push(`title = $${param++}`);
    values.push(input.title);
  }
  if (input.category !== undefined) {
    sets.push(`category = $${param++}`);
    values.push(input.category);
  }
  if (input.source_url !== undefined) {
    sets.push(`source_url = $${param++}`);
    values.push(input.source_url);
  }
  if (input.summary !== undefined) {
    sets.push(`summary = $${param++}`);
    values.push(input.summary);
  }
  if (input.content !== undefined) {
    sets.push(`content = $${param++}`);
    values.push(input.content);
  }
  if (input.focus_area_id !== undefined) {
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id);
  }

  values.push(id);

  try {
    const result = await pool.query<ResearchNote>(
      `UPDATE research_notes SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('research note not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'research note not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update research note: ${message}`);
  }
};
