import type { Pool } from 'pg';
import { updateConditionById } from '../../data/conditions/update-condition-by-id';
import type { Condition, UpdateConditionInput } from '../../data/conditions/types';

/**
 * Updates a Condition by id.
 */
export const processUpdateCondition = async (
  pool: Pool,
  id: string,
  input: UpdateConditionInput,
): Promise<Condition> => {
  return updateConditionById(pool, id, input);
};
