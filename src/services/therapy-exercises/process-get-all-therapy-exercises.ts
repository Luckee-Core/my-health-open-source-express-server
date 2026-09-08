import type { Pool } from 'pg';
import { getAllTherapyExercises } from '../../data/therapy-exercises';
import type { TherapyExercise } from '../../model/therapy-exercise';
/**
 * Loads all therapy exercises.
 */
export const processGetAllTherapyExercises = async (pool: Pool): Promise<TherapyExercise[]> => {
  return getAllTherapyExercises(pool);
};
