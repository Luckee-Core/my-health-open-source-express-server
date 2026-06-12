import type { Pool } from 'pg';
import { assertHospitalExists, assertSpecialtyExists } from './assert-relations-exist';
import type { Doctor, UpdateDoctorInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a doctor by id.
 */
export const updateDoctorById = async (
  pool: Pool,
  id: string,
  input: UpdateDoctorInput,
): Promise<Doctor> => {
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    sets.push(`name = $${param++}`);
    values.push(name);
  }
  if (input.hospital_id !== undefined) {
    if (!input.hospital_id.trim()) throw new Error('hospital_id is required');
    await assertHospitalExists(pool, input.hospital_id);
    sets.push(`hospital_id = $${param++}`);
    values.push(input.hospital_id);
  }
  if (input.specialty_id !== undefined) {
    if (!input.specialty_id.trim()) throw new Error('specialty_id is required');
    await assertSpecialtyExists(pool, input.specialty_id);
    sets.push(`specialty_id = $${param++}`);
    values.push(input.specialty_id);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(optionalText(input.notes));
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
