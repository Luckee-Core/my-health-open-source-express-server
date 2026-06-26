import type { Pool } from 'pg';
import { deleteSymptomLogById } from '../../data/symptom-logs/delete-symptom-log-by-id';

/**
 * Deletes a symptom log by id.
 */
export const processDeleteSymptomLogById = async (pool: Pool, id: string): Promise<void> => {
  await deleteSymptomLogById(pool, id);
};
