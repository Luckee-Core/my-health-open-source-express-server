import type { Pool } from 'pg';
import type { Appointment } from './types';

/**
 * Loads all appointments ordered by scheduled_at ascending.
 */
export const getAllAppointments = async (pool: Pool): Promise<Appointment[]> => {
  try {
    const result = await pool.query<Appointment>(
      'SELECT * FROM appointments ORDER BY scheduled_at ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load appointments: ${message}`);
  }
};
