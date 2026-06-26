import type { Pool } from 'pg';

/**
 * Validates that an appointment id exists when provided.
 */
export const assertAppointmentExists = async (
  pool: Pool,
  appointmentId: string,
): Promise<void> => {
  try {
    const result = await pool.query('SELECT id FROM appointments WHERE id = $1', [appointmentId]);
    if (result.rowCount === 0) {
      throw new Error('appointment not found');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'appointment not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate appointment: ${message}`);
  }
};
