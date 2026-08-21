import type { Pool } from 'pg';
import type { Medication } from './types';

/**
 * Loads one medication by id.
 */
export const getMedicationById = async (
  pool: Pool,
  id: string,
): Promise<Medication | null> => {
  const result = await pool.query<Medication>(`SELECT * FROM medications WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
};
