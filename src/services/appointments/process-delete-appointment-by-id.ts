import type { Pool } from 'pg';
import { deleteAppointmentById } from '../../data/appointments/delete-appointment-by-id';

/**
 * Deletes an appointment by id.
 */
export const processDeleteAppointmentById = async (pool: Pool, id: string): Promise<void> => {
  await deleteAppointmentById(pool, id);
};
