import type { Pool } from 'pg';
import type {
  TherapyExerciseImportAiExchange,
  UpdateTherapyExerciseImportAiExchangeInput,
} from '../../model/therapy-exercise-import-ai-exchange';

/**
 * Updates a therapy exercise import AI exchange.
 */
export const updateTherapyExerciseImportAiExchange = async (
  pool: Pool,
  id: string,
  input: UpdateTherapyExerciseImportAiExchangeInput,
): Promise<TherapyExerciseImportAiExchange> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  const setField = (column: string, value: unknown): void => {
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  if (input.response_id !== undefined) setField('response_id', input.response_id);
  if (input.import_id !== undefined) setField('import_id', input.import_id);
  if (input.input_tokens !== undefined) setField('input_tokens', input.input_tokens);
  if (input.output_tokens !== undefined) setField('output_tokens', input.output_tokens);
  if (input.total_tokens !== undefined) setField('total_tokens', input.total_tokens);
  if (input.model_used !== undefined) setField('model_used', input.model_used);
  if (input.status !== undefined) setField('status', input.status);
  if (input.error_message !== undefined) setField('error_message', input.error_message);

  if (fields.length === 0) {
    const existing = await pool.query<TherapyExerciseImportAiExchange>(
      'SELECT * FROM therapy_exercise_import_ai_exchanges WHERE id = $1',
      [id],
    );
    return existing.rows[0];
  }

  fields.push('updated_at = now()');
  values.push(id);

  const result = await pool.query<TherapyExerciseImportAiExchange>(
    `UPDATE therapy_exercise_import_ai_exchanges SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return result.rows[0];
};
