import type { Pool } from 'pg';
import type { InsuranceCoverage, UpdateInsuranceCoverageInput } from './types';

/**
 * Updates a InsuranceCoverage by id.
 */
export const updateInsuranceCoverageById = async (
  pool: Pool,
  id: string,
  input: UpdateInsuranceCoverageInput,
): Promise<InsuranceCoverage> => {
  console.log('💾 updateInsuranceCoverageById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.payer_name !== undefined) {
    sets.push(`payer_name = $${param++}`);
    values.push(input.payer_name ?? null);
  }
  if (input.member_id !== undefined) {
    sets.push(`member_id = $${param++}`);
    values.push(input.member_id ?? null);
  }
  if (input.group_number !== undefined) {
    sets.push(`group_number = $${param++}`);
    values.push(input.group_number ?? null);
  }
  if (input.plan_name !== undefined) {
    sets.push(`plan_name = $${param++}`);
    values.push(input.plan_name ?? null);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status ?? null);
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
    const result = await pool.query<InsuranceCoverage>(
      `UPDATE insurance_coverages SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('InsuranceCoverage not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'InsuranceCoverage not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update InsuranceCoverage: ${message}`);
  }
};
