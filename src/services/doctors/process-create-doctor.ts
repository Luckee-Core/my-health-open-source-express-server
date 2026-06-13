import type { Pool } from 'pg';
import { createDoctor } from '../../data/doctors/create-doctor';
import type { CreateDoctorInput, Doctor } from '../../data/doctors/types';
import { assertHospitalExists, assertSpecialtyExists } from '../../utils/doctors';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a doctor after validating input and foreign keys.
 */
export const processCreateDoctor = async (
  pool: Pool,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  const name = input.name?.trim() ?? '';
  if (!name) throw new Error('name is required');
  if (!input.hospital_id?.trim()) throw new Error('hospital_id is required');
  if (!input.specialty_id?.trim()) throw new Error('specialty_id is required');

  await assertHospitalExists(pool, input.hospital_id);
  await assertSpecialtyExists(pool, input.specialty_id);

  return createDoctor(pool, {
    name,
    hospital_id: input.hospital_id,
    specialty_id: input.specialty_id,
    notes: optionalText(input.notes),
  });
};
