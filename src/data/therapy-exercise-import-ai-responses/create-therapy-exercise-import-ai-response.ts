import type { Pool } from 'pg';
import type {
  CreateTherapyExerciseImportAiResponseInput,
  TherapyExerciseImportAiResponse,
} from '../../model/therapy-exercise-import-ai-response';

/**
 * Inserts a therapy exercise import AI response.
 */
export const createTherapyExerciseImportAiResponse = async (
  pool: Pool,
  input: CreateTherapyExerciseImportAiResponseInput,
): Promise<TherapyExerciseImportAiResponse> => {
  console.log('💾 createTherapyExerciseImportAiResponse');
  const result = await pool.query<TherapyExerciseImportAiResponse>(
    `INSERT INTO therapy_exercise_import_ai_responses (
      request_id, model, status, raw_response, parsed_response_json,
      error_message, usage_input_tokens, usage_output_tokens
    )
    VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
    RETURNING *`,
    [
      input.request_id,
      input.model,
      input.status,
      input.raw_response ?? null,
      input.parsed_response_json ? JSON.stringify(input.parsed_response_json) : null,
      input.error_message ?? null,
      input.usage_input_tokens ?? null,
      input.usage_output_tokens ?? null,
    ],
  );
  return result.rows[0];
};
