import type { Pool } from 'pg';
import type { CreateHospitalInput, Hospital } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a hospital / medical facility record.
 */
export const createHospital = async (
  pool: Pool,
  input: CreateHospitalInput,
): Promise<Hospital> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  try {
    const result = await pool.query<Hospital>(
      `INSERT INTO hospitals (name, address, email, phone, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        optionalText(input.address),
        optionalText(input.email),
        optionalText(input.phone),
        optionalText(input.notes),
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create hospital: ${message}`);
  }
};
