import type { AppointmentStatus } from '../../model/appointment';

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
