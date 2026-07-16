import type { Pool } from 'pg';
import type { Allergy, UpdateAllergyInput } from './types';

/**
 * Updates a Allergy by id.
 */
export const updateAllergyById = async (
  pool: Pool,
  id: string,
  input: UpdateAllergyInput,
): Promise<Allergy> => {
  console.log('💾 updateAllergyById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.substance !== undefined) {
    sets.push(`substance = $${param++}`);
    values.push(input.substance ?? null);
  }
  if (input.reaction !== undefined) {
    sets.push(`reaction = $${param++}`);
    values.push(input.reaction ?? null);
  }
  if (input.criticality !== undefined) {
    sets.push(`criticality = $${param++}`);
    values.push(input.criticality ?? null);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status ?? null);
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
    const result = await pool.query<Allergy>(
      `UPDATE allergies SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('Allergy not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'Allergy not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update Allergy: ${message}`);
  }
};
