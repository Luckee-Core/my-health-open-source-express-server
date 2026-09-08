import type { Pool } from 'pg';
import { updateReferralById } from '../../data/referrals/update-referral-by-id';
import type { Referral, UpdateReferralInput } from '../../model/referral';

/**
 * Updates a Referral by id.
 */
export const processUpdateReferral = async (
  pool: Pool,
  id: string,
  input: UpdateReferralInput,
): Promise<Referral> => {
  return updateReferralById(pool, id, input);
};
