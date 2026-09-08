import type { Pool } from 'pg';
import type {
  CreateTherapyExerciseImportAiExchangeInput,
  TherapyExerciseImportAiExchange,
} from '../../model/therapy-exercise-import-ai-exchange';

/**
 * Inserts a pending therapy exercise import AI exchange.
 */
export const createTherapyExerciseImportAiExchange = async (
  pool: Pool,
  input: CreateTherapyExerciseImportAiExchangeInput,
): Promise<TherapyExerciseImportAiExchange> => {
  console.log('💾 createTherapyExerciseImportAiExchange');
  const result = await pool.query<TherapyExerciseImportAiExchange>(
    `INSERT INTO therapy_exercise_import_ai_exchanges (request_id, model_used, status)
     VALUES ($1, $2, 'pending')
     RETURNING *`,
    [input.request_id, input.model_used],
  );
  return result.rows[0];
};
