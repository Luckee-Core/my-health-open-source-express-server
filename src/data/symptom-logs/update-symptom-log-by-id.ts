import type { Pool } from 'pg';
import type { SymptomLog, UpdateSymptomLogInput } from './types';

/**
 * Updates a symptom log by id.
 */
export const updateSymptomLogById = async (
  pool: Pool,
  id: string,
  input: UpdateSymptomLogInput,
): Promise<SymptomLog> => {
  console.log('💾 updateSymptomLogById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.recorded_at !== undefined) {
    sets.push(`recorded_at = $${param++}`);
    values.push(input.recorded_at);
  }
  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name);
  }
  if (input.severity !== undefined) {
    sets.push(`severity = $${param++}`);
    values.push(input.severity);
  }
  if (input.triggers !== undefined) {
    sets.push(`triggers = $${param++}`);
    values.push(input.triggers);
  }
  if (input.duration_minutes !== undefined) {
    sets.push(`duration_minutes = $${param++}`);
    values.push(input.duration_minutes);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
  }
  if (input.focus_area_id !== undefined) {
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id);
  }

  values.push(id);

  try {
    const result = await pool.query<SymptomLog>(
      `UPDATE symptom_logs SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('symptom log not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'symptom log not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update symptom log: ${message}`);
  }
};
