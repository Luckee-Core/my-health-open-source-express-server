import type { Pool } from 'pg';
import { deleteDoctorById } from '../../data/doctors/delete-doctor-by-id';

/**
 * Deletes a doctor by id.
 */
export const processDeleteDoctorById = async (pool: Pool, id: string): Promise<void> => {
  await deleteDoctorById(pool, id);
};
