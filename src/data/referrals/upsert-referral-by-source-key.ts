import type { Pool, PoolClient } from 'pg';
import type { CreateReferralInput, Referral } from '../../model/referral';

type Queryable = Pool | PoolClient;

/**
 * Upserts a Referral by (source_system, source_entry_key).
 */
export const upsertReferralBySourceKey = async (
  pool: Queryable,
  input: CreateReferralInput,
): Promise<Referral> => {
  console.log('💾 upsertReferralBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Referral>(
      `INSERT INTO referrals (referred_on, specialty, reason, status, referred_by_doctor_id, notes, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         referred_on = EXCLUDED.referred_on,
         specialty = EXCLUDED.specialty,
         reason = EXCLUDED.reason,
         status = EXCLUDED.status,
         referred_by_doctor_id = EXCLUDED.referred_by_doctor_id,
         notes = EXCLUDED.notes,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
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
    throw new Error(`Failed to upsert Referral: ${message}`);
  }
};
