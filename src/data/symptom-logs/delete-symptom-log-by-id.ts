import type { Pool } from 'pg';

/**
 * Deletes a symptom log by id.
 */
export const deleteSymptomLogById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteSymptomLogById');
  try {
    await pool.query('DELETE FROM symptom_logs WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete symptom log: ${message}`);
  }
};
