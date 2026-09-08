import type { Pool } from 'pg';
import { incrementSpeechTherapyConsumption } from '../../data/speech-therapy-consumption';
import {
  SPEECH_THERAPY_CONSUMPTION_TYPES,
  type IncrementSpeechTherapyConsumptionInput,
  type SpeechTherapyConsumption,
  type SpeechTherapyConsumptionType,
} from '../../model/speech-therapy-consumption';
import { parseLogDate } from '../../utils/therapy-exercise-logs';

/**
 * Increments today's (or a given date's) consumption quantity for a type.
 */
export const processIncrementSpeechTherapyConsumption = async (
  pool: Pool,
  input: IncrementSpeechTherapyConsumptionInput,
): Promise<SpeechTherapyConsumption> => {
  if (!input.consumption_type?.trim()) throw new Error('consumption_type is required');
  if (!input.log_date?.trim()) throw new Error('log_date is required');
  if (!Number.isFinite(input.delta) || input.delta === 0) {
    throw new Error('delta must be a non-zero number');
  }

  const consumptionType = input.consumption_type.trim();
  if (!(SPEECH_THERAPY_CONSUMPTION_TYPES as readonly string[]).includes(consumptionType)) {
    throw new Error('Invalid consumption_type');
  }
  const logDate = parseLogDate(input.log_date);

  return incrementSpeechTherapyConsumption(
    pool,
    consumptionType as SpeechTherapyConsumptionType,
    logDate,
    input.delta,
  );
};
