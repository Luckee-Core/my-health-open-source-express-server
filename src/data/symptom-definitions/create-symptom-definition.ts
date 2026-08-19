import type { Pool } from 'pg';
import type { CreateSymptomDefinitionInput, SymptomDefinition } from './types';

/**
 * Creates a symptom definition for rounds check-in.
 */
export const createSymptomDefinition = async (
  pool: Pool,
  input: CreateSymptomDefinitionInput,
): Promise<SymptomDefinition> => {
  const result = await pool.query<SymptomDefinition>(
    `INSERT INTO symptom_definitions (name, sort_order, is_active)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [input.name, input.sort_order ?? 0, input.is_active ?? true],
  );
  return result.rows[0];
};
