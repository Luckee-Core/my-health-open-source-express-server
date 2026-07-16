import type { Pool } from 'pg';
import { deleteVitalSignById } from '../../data/vital-signs/delete-vital-sign-by-id';

/**
 * Deletes a VitalSign by id.
 */
export const processDeleteVitalSign = async (pool: Pool, id: string): Promise<void> => {
  await deleteVitalSignById(pool, id);
};
