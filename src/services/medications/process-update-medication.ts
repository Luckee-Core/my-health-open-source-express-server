import type { Pool } from 'pg';
import { updateMedicationById } from '../../data/medications/update-medication-by-id';
import type { Medication, UpdateMedicationInput } from '../../model/medication';

/**
 * Updates a Medication by id.
 */
export const processUpdateMedication = async (
  pool: Pool,
  id: string,
  input: UpdateMedicationInput,
): Promise<Medication> => {
  return updateMedicationById(pool, id, input);
};
