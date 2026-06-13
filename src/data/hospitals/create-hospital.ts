import type { Pool } from 'pg';
import type { CreateHospitalInput, Hospital } from './types';

/**
 * Creates a hospital / medical facility record.
 */
export const createHospital = async (
  pool: Pool,
  input: CreateHospitalInput,
): Promise<Hospital> => {
  console.log('💾 createHospital');
  try {
    const result = await pool.query<Hospital>(
      `INSERT INTO hospitals (name, address, email, phone, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.name,
        input.address ?? null,
        input.email ?? null,
        input.phone ?? null,
        input.notes ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create hospital: ${message}`);
  }
};
