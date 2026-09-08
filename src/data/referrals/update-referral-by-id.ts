import type { Pool } from 'pg';
import type { Referral, UpdateReferralInput } from '../../model/referral';

/**
 * Updates a Referral by id.
 */
export const updateReferralById = async (
  pool: Pool,
  id: string,
  input: UpdateReferralInput,
): Promise<Referral> => {
  console.log('💾 updateReferralById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.referred_on !== undefined) {
    sets.push(`referred_on = $${param++}`);
    values.push(input.referred_on ?? null);
  }
  if (input.specialty !== undefined) {
    sets.push(`specialty = $${param++}`);
    values.push(input.specialty ?? null);
  }
  if (input.reason !== undefined) {
    sets.push(`reason = $${param++}`);
    values.push(input.reason ?? null);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status ?? null);
  }
  if (input.referred_by_doctor_id !== undefined) {
    sets.push(`referred_by_doctor_id = $${param++}`);
    values.push(input.referred_by_doctor_id ?? null);
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
    const result = await pool.query<Referral>(
      `UPDATE referrals SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('Referral not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'Referral not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update Referral: ${message}`);
  }
};
