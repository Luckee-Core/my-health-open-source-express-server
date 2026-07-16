import type { Pool } from 'pg';

/**
 * Deletes a Referral by id.
 */
export const deleteReferralById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteReferralById');
  try {
    await pool.query('DELETE FROM referrals WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete Referral: ${message}`);
  }
};
