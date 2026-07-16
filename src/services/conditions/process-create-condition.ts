import type { Pool } from 'pg';
import { createCondition } from '../../data/conditions/create-condition';
import type { CreateConditionInput, Condition } from '../../data/conditions/types';

/**
 * Creates a Condition after light validation.
 */
export const processCreateCondition = async (
  pool: Pool,
  input: CreateConditionInput,
): Promise<Condition> => {
  return createCondition(pool, input);
};
