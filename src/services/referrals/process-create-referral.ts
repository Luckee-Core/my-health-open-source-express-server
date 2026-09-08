import type { Pool } from 'pg';
import { createReferral } from '../../data/referrals/create-referral';
import type { CreateReferralInput, Referral } from '../../model/referral';

/**
 * Creates a Referral after light validation.
 */
export const processCreateReferral = async (
  pool: Pool,
  input: CreateReferralInput,
): Promise<Referral> => {
  return createReferral(pool, input);
};
