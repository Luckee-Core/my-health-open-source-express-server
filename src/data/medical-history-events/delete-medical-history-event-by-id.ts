import type { Pool } from 'pg';

/**
 * Deletes a medical history event by id.
 */
export const deleteMedicalHistoryEventById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteMedicalHistoryEventById');
  try {
    await pool.query('DELETE FROM medical_history_events WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete medical history event: ${message}`);
  }
};
