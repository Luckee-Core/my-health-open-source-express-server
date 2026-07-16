import type { Pool } from 'pg';
import type { Doctor, UpdateDoctorInput } from './types';

/**
 * Updates a doctor by id.
 */
export const updateDoctorById = async (
  pool: Pool,
  id: string,
  input: UpdateDoctorInput,
): Promise<Doctor> => {
  console.log('💾 updateDoctorById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name);
  }
  if (input.hospital_id !== undefined) {
    sets.push(`hospital_id = $${param++}`);
    values.push(input.hospital_id);
  }
  if (input.specialty_id !== undefined) {
    sets.push(`specialty_id = $${param++}`);
    values.push(input.specialty_id);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
  }
  if (input.npi !== undefined) {
    sets.push(`npi = $${param++}`);
    values.push(input.npi);
  }
  if (input.phone !== undefined) {
    sets.push(`phone = $${param++}`);
    values.push(input.phone);
  }
  if (input.fax !== undefined) {
    sets.push(`fax = $${param++}`);
    values.push(input.fax);
  }
  if (input.source_system !== undefined) {
    sets.push(`source_system = $${param++}`);
    values.push(input.source_system);
  }
  if (input.source_document_id !== undefined) {
    sets.push(`source_document_id = $${param++}`);
    values.push(input.source_document_id);
  }
  if (input.source_entry_key !== undefined) {
    sets.push(`source_entry_key = $${param++}`);
    values.push(input.source_entry_key);
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
