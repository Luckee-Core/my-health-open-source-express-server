import type { Pool } from 'pg';
import type { SymptomLog } from '../../model/symptom-log';

/**
 * Loads all symptom logs ordered by recorded_at descending.
 */
export const getAllSymptomLogs = async (pool: Pool): Promise<SymptomLog[]> => {
  console.log('💾 getAllSymptomLogs');
  try {
    const result = await pool.query<SymptomLog>(
      `SELECT * FROM symptom_logs
       ORDER BY recorded_at DESC, created_at DESC`,
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load symptom logs: ${message}`);
  }
};
