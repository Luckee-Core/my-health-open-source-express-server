import type { Pool } from 'pg';
import { deleteMedicalHistoryEventById } from '../../data/medical-history-events/delete-medical-history-event-by-id';

/**
 * Deletes a medical history event by id.
 */
export const processDeleteMedicalHistoryEventById = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  await deleteMedicalHistoryEventById(pool, id);
};
