import type { Pool, PoolClient } from 'pg';
import { SPEECH_THERAPY_CONSUMPTION_SELECT } from './select-columns';
import type {
  SpeechTherapyConsumption,
  SpeechTherapyConsumptionType,
} from '../../model/speech-therapy-consumption';

type Db = Pool | PoolClient;

/**
 * Increments or creates a consumption row for a given type and date.
 */
export const incrementSpeechTherapyConsumption = async (
  db: Db,
  consumptionType: SpeechTherapyConsumptionType,
  logDate: string,
  delta: number,
): Promise<SpeechTherapyConsumption> => {
  console.log('💾 incrementSpeechTherapyConsumption');
  const result = await db.query<SpeechTherapyConsumption>(
    `INSERT INTO speech_therapy_consumption (consumption_type, log_date, quantity)
     VALUES ($1, $2, GREATEST(0, $3))
     ON CONFLICT (consumption_type, log_date)
     DO UPDATE SET
       quantity = GREATEST(0, speech_therapy_consumption.quantity + $3),
       updated_at = now()
     RETURNING ${SPEECH_THERAPY_CONSUMPTION_SELECT}`,
    [consumptionType, logDate, delta],
  );
  return result.rows[0];
};
