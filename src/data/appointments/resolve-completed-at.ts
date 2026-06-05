import type { AppointmentStatus } from './types';

const STATUSES: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled'];

/**
 * Returns true when value is a valid appointment status.
 */
export const isAppointmentStatus = (value: string): value is AppointmentStatus =>
  STATUSES.includes(value as AppointmentStatus);

/**
 * Resolves completed_at based on status transition.
 */
export const resolveCompletedAt = (
  status: AppointmentStatus,
  explicitCompletedAt?: string | null,
): string | null => {
  if (status !== 'completed') return null;
  if (explicitCompletedAt?.trim()) return explicitCompletedAt;
  return new Date().toISOString();
};
