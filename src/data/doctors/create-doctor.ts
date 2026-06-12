import type { Pool } from 'pg';
import { assertHospitalExists, assertSpecialtyExists } from './assert-relations-exist';
import type { CreateDoctorInput, Doctor } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a doctor record.
 */
export const createDoctor = async (
  pool: Pool,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }
  if (!input.hospital_id?.trim()) {
    throw new Error('hospital_id is required');
  }
  if (!input.specialty_id?.trim()) {
    throw new Error('specialty_id is required');
  }

  await assertHospitalExists(pool, input.hospital_id);
  await assertSpecialtyExists(pool, input.specialty_id);

  try {
    const result = await pool.query<Doctor>(
      `INSERT INTO doctors (name, hospital_id, specialty_id, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, input.hospital_id, input.specialty_id, optionalText(input.notes)],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create doctor: ${message}`);
  }
};
