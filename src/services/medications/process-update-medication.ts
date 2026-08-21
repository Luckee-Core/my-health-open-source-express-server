import type { Pool } from 'pg';
import { updateMedicationById } from '../../data/medications/update-medication-by-id';
import type { Medication, UpdateMedicationInput } from '../../data/medications/types';
import { syncMedicationDoseScheduleFromInstructions } from './sync-medication-dose-schedule';

/**
 * Updates a Medication by id.
 */
export const processUpdateMedication = async (
  pool: Pool,
  id: string,
  input: UpdateMedicationInput,
): Promise<Medication> => {
  const updated = await updateMedicationById(pool, id, input);
  await syncMedicationDoseScheduleFromInstructions(
    pool,
    updated.id,
    updated.instructions,
    updated.status,
  );
  return updated;
};
