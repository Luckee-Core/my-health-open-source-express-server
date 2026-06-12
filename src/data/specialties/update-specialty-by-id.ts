import type { Pool } from 'pg';
import type { Specialty, UpdateSpecialtyInput } from './types';

/**
 * Updates a specialty by id.
 */
export const updateSpecialtyById = async (
  pool: Pool,
  id: string,
  input: UpdateSpecialtyInput,
): Promise<Specialty> => {
  const sets: string[] = ['updated_at = now()'];
  const values: string[] = [];
  let param = 1;

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    sets.push(`name = $${param++}`);
    values.push(name);
  }

  values.push(id);

  try {
    const result = await pool.query<Specialty>(
      `UPDATE specialties SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('specialty not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'specialty not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update specialty: ${message}`);
  }
};
