import type { Pool } from 'pg';
import type { MedicalHistoryEvent } from './types';

/**
 * Loads all medical history events ordered by event date descending.
 */
export const getAllMedicalHistoryEvents = async (pool: Pool): Promise<MedicalHistoryEvent[]> => {
  console.log('💾 getAllMedicalHistoryEvents');
  try {
    const result = await pool.query<MedicalHistoryEvent>(
      `SELECT * FROM medical_history_events
       ORDER BY event_date DESC, created_at DESC`,
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load medical history events: ${message}`);
  }
};
