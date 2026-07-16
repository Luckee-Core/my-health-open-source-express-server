import type { Pool } from 'pg';
import { deleteConditionById } from '../../data/conditions/delete-condition-by-id';

/**
 * Deletes a Condition by id.
 */
export const processDeleteCondition = async (pool: Pool, id: string): Promise<void> => {
  await deleteConditionById(pool, id);
};
