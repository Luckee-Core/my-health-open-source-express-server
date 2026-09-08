import type { Pool } from 'pg';
import type {
  CreateTherapyExerciseImportAiRequestInput,
  TherapyExerciseImportAiRequest,
} from '../../model/therapy-exercise-import-ai-request';

/**
 * Inserts a pending therapy exercise import AI request.
 */
export const createTherapyExerciseImportAiRequest = async (
  pool: Pool,
  input: CreateTherapyExerciseImportAiRequestInput,
): Promise<TherapyExerciseImportAiRequest> => {
  console.log('💾 createTherapyExerciseImportAiRequest');
  const result = await pool.query<TherapyExerciseImportAiRequest>(
    `INSERT INTO therapy_exercise_import_ai_requests (
      provider, model, mime_type, filename, system_prompt, status
    )
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING *`,
    [
      input.provider ?? 'anthropic',
      input.model,
      input.mime_type ?? null,
      input.filename ?? null,
      input.system_prompt,
    ],
  );
  return result.rows[0];
};
