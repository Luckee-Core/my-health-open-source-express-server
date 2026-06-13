import type { Pool } from 'pg';
import type { Hospital, UpdateHospitalInput } from './types';

/**
 * Updates a hospital by id.
 */
export const updateHospitalById = async (
  pool: Pool,
  id: string,
  input: UpdateHospitalInput,
): Promise<Hospital> => {
  console.log('💾 updateHospitalById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name);
  }
  if (input.address !== undefined) {
    sets.push(`address = $${param++}`);
    values.push(input.address);
  }
  if (input.email !== undefined) {
    sets.push(`email = $${param++}`);
    values.push(input.email);
  }
  if (input.phone !== undefined) {
    sets.push(`phone = $${param++}`);
    values.push(input.phone);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
  }

  values.push(id);

  try {
    const result = await pool.query<Hospital>(
      `UPDATE hospitals SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('hospital not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'hospital not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update hospital: ${message}`);
  }
};
