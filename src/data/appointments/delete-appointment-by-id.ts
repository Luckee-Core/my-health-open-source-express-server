import type { Pool } from 'pg';

/**
 * Deletes an appointment by id.
 */
export const deleteAppointmentById = async (pool: Pool, id: string): Promise<void> => {
  try {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete appointment: ${message}`);
  }
};
