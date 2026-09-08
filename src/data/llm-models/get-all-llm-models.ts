import type { Pool } from 'pg';
import type { LlmModel } from '../../model/llm-model';

/**
 * Loads all LLM model pricing rows.
 */
export const getAllLlmModels = async (pool: Pool): Promise<LlmModel[]> => {
  const result = await pool.query<LlmModel>(
    `SELECT * FROM llm_models ORDER BY model ASC`,
  );
  return result.rows;
};
