import type { Pool } from 'pg';
import { deleteReferralById } from '../../data/referrals/delete-referral-by-id';

/**
 * Deletes a Referral by id.
 */
export const processDeleteReferral = async (pool: Pool, id: string): Promise<void> => {
  await deleteReferralById(pool, id);
};
