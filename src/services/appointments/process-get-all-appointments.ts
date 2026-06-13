import type { Pool } from 'pg';
import { getAllAppointments } from '../../data/appointments/get-all-appointments';
import type { Appointment } from '../../data/appointments/types';

/**
 * Loads all appointments.
 */
export const processGetAllAppointments = async (pool: Pool): Promise<Appointment[]> => {
  return getAllAppointments(pool);
};
