import type { Pool } from 'pg';
import { getAllVitalSigns } from '../../data/vital-signs/get-all-vital-signs';
import type { VitalSign } from '../../model/vital-sign';

/**
 * Lists all vital-signs.
 */
export const processListVitalSigns = async (pool: Pool): Promise<VitalSign[]> => {
  return getAllVitalSigns(pool);
};
