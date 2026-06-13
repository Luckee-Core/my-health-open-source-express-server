import type { Pool } from 'pg';
import type { Appointment } from './types';

/**
 * Fetches one appointment row by id.
 */
export const getAppointmentById = async (
  pool: Pool,
  id: string,
): Promise<Appointment | null> => {
  console.log('💾 getAppointmentById');
  try {
    const result = await pool.query<Appointment>(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load appointment: ${message}`);
  }
};
