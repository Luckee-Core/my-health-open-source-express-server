import type { Pool } from 'pg';
import { getAllMedicalHistoryEvents } from '../../data/medical-history-events/get-all-medical-history-events';
import type { MedicalHistoryEvent } from '../../model/medical-history-event';

/**
 * Loads all medical history events.
 */
export const processGetAllMedicalHistoryEvents = async (
  pool: Pool,
): Promise<MedicalHistoryEvent[]> => getAllMedicalHistoryEvents(pool);
