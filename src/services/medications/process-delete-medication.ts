import type { Pool } from 'pg';
import { deleteMedicationById } from '../../data/medications/delete-medication-by-id';

/**
 * Deletes a Medication by id.
 */
export const processDeleteMedication = async (pool: Pool, id: string): Promise<void> => {
  await deleteMedicationById(pool, id);
};
