import type { Pool } from 'pg';
import type { Referral } from './types';

/**
 * Loads all referrals.
 */
export const getAllReferrals = async (pool: Pool): Promise<Referral[]> => {
  console.log('💾 getAllReferrals');
  try {
    const result = await pool.query<Referral>(
      'SELECT * FROM referrals ORDER BY referred_on DESC NULLS LAST',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load referrals: ${message}`);
  }
};
