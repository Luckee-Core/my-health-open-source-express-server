import type { Pool } from 'pg';
import { deleteHospitalById } from '../../data/hospitals/delete-hospital-by-id';

/**
 * Deletes a hospital by id.
 */
export const processDeleteHospitalById = async (pool: Pool, id: string): Promise<void> => {
  await deleteHospitalById(pool, id);
};
