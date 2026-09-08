import type { Pool } from 'pg';
import { getAllTherapyExerciseImportAiExchanges } from '../../data/therapy-exercise-import-ai-exchanges';
import type { TherapyExerciseImportAiExchange } from '../../model/therapy-exercise-import-ai-exchange';
/**
 * Loads completed therapy exercise import AI exchanges.
 */
export const processGetAllTherapyExerciseImportAiExchanges = async (
  pool: Pool,
): Promise<TherapyExerciseImportAiExchange[]> => {
  return getAllTherapyExerciseImportAiExchanges(pool);
};
