import type { Pool } from 'pg';
import type { ClinicalResult, UpdateClinicalResultInput } from './types';

/**
 * Updates a ClinicalResult by id.
 */
export const updateClinicalResultById = async (
  pool: Pool,
  id: string,
  input: UpdateClinicalResultInput,
): Promise<ClinicalResult> => {
  console.log('💾 updateClinicalResultById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.observed_at !== undefined) {
    sets.push(`observed_at = $${param++}`);
    values.push(input.observed_at ?? null);
  }
  if (input.name !== undefined) {
    sets.push(`name = $${param++}`);
    values.push(input.name ?? null);
  }
  if (input.value_text !== undefined) {
    sets.push(`value_text = $${param++}`);
    values.push(input.value_text ?? null);
  }
  if (input.unit !== undefined) {
    sets.push(`unit = $${param++}`);
    values.push(input.unit ?? null);
  }
  if (input.interpretation !== undefined) {
    sets.push(`interpretation = $${param++}`);
    values.push(input.interpretation ?? null);
  }
  if (input.category !== undefined) {
    sets.push(`category = $${param++}`);
    values.push(input.category ?? null);
  }
  if (input.appointment_id !== undefined) {
    sets.push(`appointment_id = $${param++}`);
    values.push(input.appointment_id ?? null);
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
    const result = await pool.query<ClinicalResult>(
      `UPDATE clinical_results SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('ClinicalResult not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'ClinicalResult not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update ClinicalResult: ${message}`);
  }
};
