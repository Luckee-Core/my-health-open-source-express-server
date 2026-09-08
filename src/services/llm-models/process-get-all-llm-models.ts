import type { Pool } from 'pg';
import { getAllLlmModels } from '../../data/llm-models';
import type { LlmModel } from '../../model/llm-model';
/**
 * Loads LLM model pricing rows.
 */
export const processGetAllLlmModels = async (pool: Pool): Promise<LlmModel[]> => {
  return getAllLlmModels(pool);
};
