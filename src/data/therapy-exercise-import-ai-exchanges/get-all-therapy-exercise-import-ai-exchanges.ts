import type { Pool } from 'pg';
import type { TherapyExerciseImportAiExchange } from '../../model/therapy-exercise-import-ai-exchange';

/**
 * Loads completed therapy exercise import AI exchanges with token usage.
 */
export const getAllTherapyExerciseImportAiExchanges = async (
  pool: Pool,
): Promise<TherapyExerciseImportAiExchange[]> => {
  const result = await pool.query<TherapyExerciseImportAiExchange>(
    `SELECT * FROM therapy_exercise_import_ai_exchanges
     WHERE status = 'completed'
       AND input_tokens IS NOT NULL
       AND output_tokens IS NOT NULL
     ORDER BY created_at DESC`,
  );
  return result.rows;
};
