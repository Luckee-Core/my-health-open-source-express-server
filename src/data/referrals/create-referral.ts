import type { Pool, PoolClient } from 'pg';
import type { CreateReferralInput, Referral } from '../../model/referral';

type Queryable = Pool | PoolClient;

/**
 * Creates a Referral record.
 */
export const createReferral = async (
  pool: Queryable,
  input: CreateReferralInput,
): Promise<Referral> => {
  console.log('💾 createReferral');
  try {
    const result = await pool.query<Referral>(
      `INSERT INTO referrals (referred_on, specialty, reason, status, referred_by_doctor_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        input.referred_on ?? null,
        input.specialty ?? null,
        input.reason ?? null,
        input.status ?? null,
        input.referred_by_doctor_id ?? null,
        input.notes ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create Referral: ${message}`);
  }
};
