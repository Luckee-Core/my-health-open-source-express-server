import type { AppointmentStatus } from '../../model/appointment';

const STATUSES: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled'];

/**
 * Returns true when value is a valid appointment status.
 */
export const isAppointmentStatus = (value: string): value is AppointmentStatus =>
  STATUSES.includes(value as AppointmentStatus);
