import type { Pool } from 'pg';
import { getAllHospitals } from '../../data/hospitals/get-all-hospitals';
import type { Hospital } from '../../model/hospital';

/**
 * Loads all hospitals.
 */
export const processGetAllHospitals = async (pool: Pool): Promise<Hospital[]> => {
  return getAllHospitals(pool);
};
