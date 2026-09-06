import type { TherapyExerciseTrackingKind } from '../../data/therapy-exercises';

const TRACKING_KINDS: TherapyExerciseTrackingKind[] = ['timed_attempts', 'sets_reps'];

/**
 * Validates tracking_kind value.
 */
export const parseTrackingKind = (value: string): TherapyExerciseTrackingKind => {
  if (!TRACKING_KINDS.includes(value as TherapyExerciseTrackingKind)) {
    throw new Error('tracking_kind must be timed_attempts or sets_reps');
  }
  return value as TherapyExerciseTrackingKind;
};
