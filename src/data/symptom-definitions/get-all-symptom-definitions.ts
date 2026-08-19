import type { Pool } from 'pg';
import type { SymptomDefinition } from './types';

/**
 * Lists active symptom definitions ordered for check-in UI.
 */
export const getAllSymptomDefinitions = async (pool: Pool): Promise<SymptomDefinition[]> => {
  const result = await pool.query<SymptomDefinition>(
    `SELECT * FROM symptom_definitions
     WHERE is_active = true
     ORDER BY sort_order ASC, name ASC`,
  );
  return result.rows;
};
