import type { Pool } from 'pg';
import type { TherapyExercise, UpdateTherapyExerciseInput } from './types';

/**
 * Updates a therapy exercise by id.
 */
export const updateTherapyExerciseById = async (
  pool: Pool,
  id: string,
  input: UpdateTherapyExerciseInput,
): Promise<TherapyExercise | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  const setField = (column: string, value: unknown): void => {
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  if (input.discipline !== undefined) setField('discipline', input.discipline);
  if (input.name !== undefined) setField('name', input.name);
  if (input.instructions !== undefined) setField('instructions', input.instructions);
  if (input.tracking_kind !== undefined) setField('tracking_kind', input.tracking_kind);
  if (input.target_count !== undefined) setField('target_count', input.target_count);
  if (input.unit_size !== undefined) setField('unit_size', input.unit_size);
  if (input.frequency !== undefined) setField('frequency', input.frequency);
  if (input.is_active !== undefined) setField('is_active', input.is_active);
  if (input.sort_order !== undefined) setField('sort_order', input.sort_order);
  if (input.source !== undefined) setField('source', input.source);
  if (input.import_id !== undefined) setField('import_id', input.import_id);

  if (fields.length === 0) {
    const existing = await pool.query<TherapyExercise>(
      'SELECT * FROM therapy_exercises WHERE id = $1',
      [id],
    );
    return existing.rows[0] ?? null;
  }

  fields.push(`updated_at = now()`);
  values.push(id);

  const result = await pool.query<TherapyExercise>(
    `UPDATE therapy_exercises SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
};
