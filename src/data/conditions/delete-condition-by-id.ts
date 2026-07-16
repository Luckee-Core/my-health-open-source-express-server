import type { Pool } from 'pg';

/**
 * Deletes a Condition by id.
 */
export const deleteConditionById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteConditionById');
  try {
    await pool.query('DELETE FROM conditions WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete Condition: ${message}`);
  }
};
