import type { Pool } from 'pg';
import { createMedication } from '../../data/medications/create-medication';
import type { CreateMedicationInput, Medication } from '../../data/medications/types';

/**
 * Creates a Medication after light validation.
 */
export const processCreateMedication = async (
  pool: Pool,
  input: CreateMedicationInput,
): Promise<Medication> => {
  return createMedication(pool, input);
};
