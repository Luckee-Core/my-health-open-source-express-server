import type { Pool } from 'pg';
import { createVitalSign } from '../../data/vital-signs/create-vital-sign';
import type { CreateVitalSignInput, VitalSign } from '../../model/vital-sign';

/**
 * Creates a VitalSign after light validation.
 */
export const processCreateVitalSign = async (
  pool: Pool,
  input: CreateVitalSignInput,
): Promise<VitalSign> => {
  return createVitalSign(pool, input);
};
