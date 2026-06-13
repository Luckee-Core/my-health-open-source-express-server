import type { Pool } from 'pg';
import { createHospital } from '../../data/hospitals/create-hospital';
import type { CreateHospitalInput, Hospital } from '../../data/hospitals/types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a hospital after validating input.
 */
export const processCreateHospital = async (
  pool: Pool,
  input: CreateHospitalInput,
): Promise<Hospital> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  return createHospital(pool, {
    name,
    address: optionalText(input.address),
    email: optionalText(input.email),
    phone: optionalText(input.phone),
    notes: optionalText(input.notes),
  });
};
