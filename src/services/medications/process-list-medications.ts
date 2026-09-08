import type { Pool } from 'pg';
import { getAllMedications } from '../../data/medications/get-all-medications';
import type { Medication } from '../../model/medication';

/**
 * Lists all medications.
 */
export const processListMedications = async (pool: Pool): Promise<Medication[]> => {
  return getAllMedications(pool);
};
