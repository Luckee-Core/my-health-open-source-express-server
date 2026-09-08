import type { Pool } from 'pg';
import { updateVitalSignById } from '../../data/vital-signs/update-vital-sign-by-id';
import type { VitalSign, UpdateVitalSignInput } from '../../model/vital-sign';

/**
 * Updates a VitalSign by id.
 */
export const processUpdateVitalSign = async (
  pool: Pool,
  id: string,
  input: UpdateVitalSignInput,
): Promise<VitalSign> => {
  return updateVitalSignById(pool, id, input);
};
