import type { Pool } from 'pg';
import { updateDoctorById } from '../../data/doctors/update-doctor-by-id';
import type { Doctor, UpdateDoctorInput } from '../../data/doctors/types';
import { assertHospitalExists, assertSpecialtyExists } from '../../utils/doctors';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a doctor by id after validating input and foreign keys.
 */
export const processUpdateDoctorById = async (
  pool: Pool,
  id: string,
  input: UpdateDoctorInput,
): Promise<Doctor> => {
  const normalized: UpdateDoctorInput = { ...input };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    normalized.name = name;
  }
  if (input.hospital_id !== undefined) {
    if (!input.hospital_id.trim()) throw new Error('hospital_id is required');
    await assertHospitalExists(pool, input.hospital_id);
    normalized.hospital_id = input.hospital_id;
  }
  if (input.specialty_id !== undefined) {
    if (!input.specialty_id.trim()) throw new Error('specialty_id is required');
    await assertSpecialtyExists(pool, input.specialty_id);
    normalized.specialty_id = input.specialty_id;
  }
  if (input.notes !== undefined) normalized.notes = optionalText(input.notes);

  return updateDoctorById(pool, id, normalized);
};
