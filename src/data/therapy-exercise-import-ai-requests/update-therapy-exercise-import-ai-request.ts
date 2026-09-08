import type { Pool } from 'pg';
import type {
  TherapyExerciseImportAiRequest,
  UpdateTherapyExerciseImportAiRequestInput,
} from '../../model/therapy-exercise-import-ai-request';

/**
 * Updates a therapy exercise import AI request.
 */
export const updateTherapyExerciseImportAiRequest = async (
  pool: Pool,
  id: string,
  input: UpdateTherapyExerciseImportAiRequestInput,
): Promise<TherapyExerciseImportAiRequest> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  const setField = (column: string, value: unknown): void => {
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  if (input.status !== undefined) setField('status', input.status);
  if (input.exchange_id !== undefined) setField('exchange_id', input.exchange_id);
  if (input.import_id !== undefined) setField('import_id', input.import_id);

  if (fields.length === 0) {
    const existing = await pool.query<TherapyExerciseImportAiRequest>(
      'SELECT * FROM therapy_exercise_import_ai_requests WHERE id = $1',
      [id],
    );
    return existing.rows[0];
  }

  fields.push('updated_at = now()');
  values.push(id);

  const result = await pool.query<TherapyExerciseImportAiRequest>(
    `UPDATE therapy_exercise_import_ai_requests SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return result.rows[0];
};
