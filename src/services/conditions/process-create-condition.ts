import type { Pool } from 'pg';
import { createCondition } from '../../data/conditions/create-condition';
import type { CreateConditionInput, Condition } from '../../model/condition';

/**
 * Creates a Condition after light validation.
 */
export const processCreateCondition = async (
  pool: Pool,
  input: CreateConditionInput,
): Promise<Condition> => {
  return createCondition(pool, input);
};
