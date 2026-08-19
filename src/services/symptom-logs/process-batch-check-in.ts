import type { Pool } from 'pg';
import { batchCreateSymptomLogs, type BatchCheckInEntry } from '../../data/symptom-logs/batch-create-symptom-logs';

export type CheckInEntryInput = {
  symptom_definition_id: string;
  time_period: 'last_night' | 'this_morning' | 'now' | 'other';
  severity?: number | null;
  notes?: string | null;
};

/**
 * Creates a batch of symptom logs for morning rounds check-in.
 */
export const processBatchCheckIn = async (
  pool: Pool,
  entries: CheckInEntryInput[],
) => {
  if (!entries.length) throw new Error('at least one entry is required');

  const definitionIds = [...new Set(entries.map((e) => e.symptom_definition_id))];
  const defs = await pool.query<{ id: string; name: string }>(
    `SELECT id, name FROM symptom_definitions WHERE id = ANY($1::uuid[]) AND is_active = true`,
    [definitionIds],
  );
  const nameById = new Map(defs.rows.map((row) => [row.id, row.name]));

  const batch: BatchCheckInEntry[] = [];
  for (const entry of entries) {
    const name = nameById.get(entry.symptom_definition_id);
    if (!name) throw new Error(`unknown symptom_definition_id: ${entry.symptom_definition_id}`);
    if (entry.severity == null) throw new Error(`severity is required for ${name}`);
    batch.push({
      symptom_definition_id: entry.symptom_definition_id,
      time_period: entry.time_period,
      name,
      severity: entry.severity,
      notes: entry.notes?.trim() || null,
    });
  }

  return batchCreateSymptomLogs(pool, batch);
};
