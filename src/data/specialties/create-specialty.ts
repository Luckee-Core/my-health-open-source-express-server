import type { Pool } from 'pg';
import type { CreateSpecialtyInput, Specialty } from './types';

/**
 * Creates a specialty record.
 */
export const createSpecialty = async (
  pool: Pool,
  input: CreateSpecialtyInput,
): Promise<Specialty> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  try {
    const result = await pool.query<Specialty>(
      'INSERT INTO specialties (name) VALUES ($1) RETURNING *',
      [name],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create specialty: ${message}`);
  }
};
