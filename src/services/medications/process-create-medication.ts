import type { Pool } from 'pg';
import { createMedication } from '../../data/medications/create-medication';
import type { CreateMedicationInput, Medication } from '../../data/medications/types';
import { syncMedicationDoseScheduleFromInstructions } from './sync-medication-dose-schedule';

/**
 * Creates a Medication after light validation.
 */
export const processCreateMedication = async (
  pool: Pool,
  input: CreateMedicationInput,
): Promise<Medication> => {
  const created = await createMedication(pool, input);
  await syncMedicationDoseScheduleFromInstructions(
    pool,
    created.id,
    created.instructions,
    created.status,
  );
  return created;
};
