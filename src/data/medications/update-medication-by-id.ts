import type { Pool } from 'pg';
import type { Medication, UpdateMedicationInput } from './types';

/**
 * Updates a Medication by id.
 */
export const updateMedicationById = async (
  pool: Pool,
  id: string,
  input: UpdateMedicationInput,
): Promise<Medication> => {
  console.log('💾 updateMedicationById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name ?? null);
  }
  if (input.instructions !== undefined) {
    sets.push(`instructions = $${param++}`);
    values.push(input.instructions ?? null);
  }
  if (input.started_on !== undefined) {
    sets.push(`started_on = $${param++}`);
    values.push(input.started_on ?? null);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status ?? null);
  }
  if (input.doctor_id !== undefined) {
    sets.push(`doctor_id = $${param++}`);
    values.push(input.doctor_id ?? null);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes ?? null);
  }
  if (input.source_system !== undefined) {
    sets.push(`source_system = $${param++}`);
    values.push(input.source_system ?? null);
  }
  if (input.source_document_id !== undefined) {
    sets.push(`source_document_id = $${param++}`);
    values.push(input.source_document_id ?? null);
  }
  if (input.source_entry_key !== undefined) {
    sets.push(`source_entry_key = $${param++}`);
    values.push(input.source_entry_key ?? null);
  }

  values.push(id);

  try {
    const result = await pool.query<Medication>(
      `UPDATE medications SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('Medication not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'Medication not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update Medication: ${message}`);
  }
};
