import type { Pool } from 'pg';
import { updateHospitalById } from '../../data/hospitals/update-hospital-by-id';
import type { Hospital, UpdateHospitalInput } from '../../data/hospitals/types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a hospital by id after validating input.
 */
export const processUpdateHospitalById = async (
  pool: Pool,
  id: string,
  input: UpdateHospitalInput,
): Promise<Hospital> => {
  const normalized: UpdateHospitalInput = { ...input };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    normalized.name = name;
  }
  if (input.address !== undefined) normalized.address = optionalText(input.address);
  if (input.email !== undefined) normalized.email = optionalText(input.email);
  if (input.phone !== undefined) normalized.phone = optionalText(input.phone);
  if (input.notes !== undefined) normalized.notes = optionalText(input.notes);

  return updateHospitalById(pool, id, normalized);
};
