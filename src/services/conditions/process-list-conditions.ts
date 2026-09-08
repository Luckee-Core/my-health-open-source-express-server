import type { Pool } from 'pg';
import { getAllConditions } from '../../data/conditions/get-all-conditions';
import type { Condition } from '../../model/condition';

/**
 * Lists all conditions.
 */
export const processListConditions = async (pool: Pool): Promise<Condition[]> => {
  return getAllConditions(pool);
};
