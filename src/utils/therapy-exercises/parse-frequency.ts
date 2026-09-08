import type { TherapyExerciseFrequency } from '../../model/therapy-exercise';
const FREQUENCIES: TherapyExerciseFrequency[] = ['daily', 'session'];

/**
 * Validates frequency: daily homework vs therapy-session-only.
 */
export const parseFrequency = (value: string): TherapyExerciseFrequency => {
  if (!FREQUENCIES.includes(value as TherapyExerciseFrequency)) {
    throw new Error('frequency must be daily or session');
  }
  return value as TherapyExerciseFrequency;
};
