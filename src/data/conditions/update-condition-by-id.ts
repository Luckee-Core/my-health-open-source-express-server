import type { Pool } from 'pg';
import type { Condition, UpdateConditionInput } from './types';

/**
 * Updates a Condition by id.
 */
export const updateConditionById = async (
  pool: Pool,
  id: string,
  input: UpdateConditionInput,
): Promise<Condition> => {
  console.log('💾 updateConditionById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name ?? null);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status ?? null);
  }
  if (input.noted_on !== undefined) {
    sets.push(`noted_on = $${param++}`);
    values.push(input.noted_on ?? null);
  }
  if (input.diagnosed_on !== undefined) {
    sets.push(`diagnosed_on = $${param++}`);
    values.push(input.diagnosed_on ?? null);
  }
  if (input.focus_area_id !== undefined) {
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id ?? null);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes ?? null);
  }
  if (input.source_system !== undefined) {
    sets.push(`source_system = $${param++}`);
    values.push(input.source_system ?? null);
  }
  if (input.source_document_id !== undefined) {
    sets.push(`source_document_id = $${param++}`);
    values.push(input.source_document_id ?? null);
  }
  if (input.source_entry_key !== undefined) {
    sets.push(`source_entry_key = $${param++}`);
    values.push(input.source_entry_key ?? null);
  }

  values.push(id);

  try {
    const result = await pool.query<Condition>(
      `UPDATE conditions SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('Condition not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'Condition not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update Condition: ${message}`);
  }
};
