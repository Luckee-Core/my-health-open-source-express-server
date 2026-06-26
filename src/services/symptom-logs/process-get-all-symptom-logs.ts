import type { Pool } from 'pg';
import { getAllSymptomLogs } from '../../data/symptom-logs/get-all-symptom-logs';
import type { SymptomLog } from '../../data/symptom-logs/types';

/**
 * Loads all symptom logs.
 */
export const processGetAllSymptomLogs = async (pool: Pool): Promise<SymptomLog[]> =>
  getAllSymptomLogs(pool);
