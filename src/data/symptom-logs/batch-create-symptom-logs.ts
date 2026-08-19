import type { Pool } from 'pg';
import type { CreateSymptomLogInput, SymptomLog } from './types';
import { createSymptomLog } from './create-symptom-log';

export type BatchCheckInEntry = CreateSymptomLogInput & {
  symptom_definition_id: string;
  time_period: NonNullable<CreateSymptomLogInput['time_period']>;
};

/**
 * Creates multiple symptom log rows for a morning check-in.
 */
export const batchCreateSymptomLogs = async (
  pool: Pool,
  entries: BatchCheckInEntry[],
): Promise<SymptomLog[]> => {
  console.log('💾 batchCreateSymptomLogs', entries.length);
  const created: SymptomLog[] = [];
  for (const entry of entries) {
    const row = await createSymptomLog(pool, entry);
    created.push(row);
  }
  return created;
};
