import type { Pool } from 'pg';
import type { CreateDoctorInput, Doctor } from './types';

/**
 * Creates a doctor record.
 */
export const createDoctor = async (
  pool: Pool,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  console.log('💾 createDoctor');
  try {
    const result = await pool.query<Doctor>(
      `INSERT INTO doctors (name, hospital_id, specialty_id, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [input.name, input.hospital_id, input.specialty_id, input.notes ?? null],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create doctor: ${message}`);
  }
};
