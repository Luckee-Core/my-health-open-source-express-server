import type { Pool } from 'pg';
import { getAllReferrals } from '../../data/referrals/get-all-referrals';
import type { Referral } from '../../data/referrals/types';

/**
 * Lists all referrals.
 */
export const processListReferrals = async (pool: Pool): Promise<Referral[]> => {
  return getAllReferrals(pool);
};
