import type { Pool } from 'pg';
import { SPEECH_THERAPY_CONSUMPTION_SELECT } from './select-columns';
import type { SpeechTherapyConsumption } from '../../model/speech-therapy-consumption';

/**
 * Loads all speech therapy consumption rows newest first.
 */
export const getAllSpeechTherapyConsumption = async (
  pool: Pool,
): Promise<SpeechTherapyConsumption[]> => {
  const result = await pool.query<SpeechTherapyConsumption>(
    `SELECT ${SPEECH_THERAPY_CONSUMPTION_SELECT}
     FROM speech_therapy_consumption
     ORDER BY log_date DESC, created_at DESC`,
  );
  return result.rows;
};
