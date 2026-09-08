import type { Pool } from 'pg';
import { getAllSpeechTherapyConsumption } from '../../data/speech-therapy-consumption';
import type { SpeechTherapyConsumption } from '../../model/speech-therapy-consumption';

/**
 * Loads all speech therapy consumption rows.
 */
export const processGetAllSpeechTherapyConsumption = async (
  pool: Pool,
): Promise<SpeechTherapyConsumption[]> => {
  return getAllSpeechTherapyConsumption(pool);
};
