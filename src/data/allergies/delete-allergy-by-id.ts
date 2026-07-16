import type { Pool } from 'pg';

/**
 * Deletes a Allergy by id.
 */
export const deleteAllergyById = async (pool: Pool, id: string): Promise<void> => {
  console.log('💾 deleteAllergyById');
  try {
    await pool.query('DELETE FROM allergies WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete Allergy: ${message}`);
  }
};
