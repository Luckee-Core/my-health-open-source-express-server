import type { Pool } from 'pg';
import type { Doctor, UpdateDoctorInput } from './types';

/**
 * Updates a doctor by id.
 */
export const updateDoctorById = async (
  pool: Pool,
  id: string,
  input: UpdateDoctorInput,
): Promise<Doctor> => {
  console.log('💾 updateDoctorById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name);
  }
  if (input.hospital_id !== undefined) {
    sets.push(`hospital_id = $${param++}`);
    values.push(input.hospital_id);
  }
  if (input.specialty_id !== undefined) {
    sets.push(`specialty_id = $${param++}`);
    values.push(input.specialty_id);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
  }

  values.push(id);

  try {
    const result = await pool.query<Doctor>(
      `UPDATE doctors SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('doctor not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'doctor not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update doctor: ${message}`);
  }
};
