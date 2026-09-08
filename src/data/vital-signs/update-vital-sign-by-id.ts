import type { Pool } from 'pg';
import type { VitalSign, UpdateVitalSignInput } from '../../model/vital-sign';

/**
 * Updates a VitalSign by id.
 */
export const updateVitalSignById = async (
  pool: Pool,
  id: string,
  input: UpdateVitalSignInput,
): Promise<VitalSign> => {
  console.log('💾 updateVitalSignById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.recorded_at !== undefined) {
    sets.push(`recorded_at = $${param++}`);
    values.push(input.recorded_at ?? null);
  }
  if (input.metric !== undefined) {
    sets.push(`metric = $${param++}`);
    values.push(input.metric ?? null);
  }
  if (input.value_text !== undefined) {
    sets.push(`value_text = $${param++}`);
    values.push(input.value_text ?? null);
  }
  if (input.numeric_value !== undefined) {
    sets.push(`numeric_value = $${param++}`);
    values.push(input.numeric_value as number | null);
  }
  if (input.unit !== undefined) {
    sets.push(`unit = $${param++}`);
    values.push(input.unit ?? null);
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
    const result = await pool.query<VitalSign>(
      `UPDATE vital_signs SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('VitalSign not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'VitalSign not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update VitalSign: ${message}`);
  }
};
