import type { Pool } from 'pg';
import { getAllDoctors } from '../../data/doctors/get-all-doctors';
import type { Doctor } from '../../data/doctors/types';

/**
 * Loads all doctors.
 */
export const processGetAllDoctors = async (pool: Pool): Promise<Doctor[]> => {
  return getAllDoctors(pool);
};
