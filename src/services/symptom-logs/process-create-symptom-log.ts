import type { Pool } from 'pg';
import { createSymptomLog } from '../../data/symptom-logs/create-symptom-log';
import type { CreateSymptomLogInput, SymptomLog } from '../../model/symptom-log';
import {
  assertOptionalHealthRecordFks,
  parseDurationMinutes,
  parseSeverity,
} from '../../utils/health-record';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const optionalId = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a symptom log after validating input and foreign keys.
 */
export const processCreateSymptomLog = async (
  pool: Pool,
  input: CreateSymptomLogInput,
): Promise<SymptomLog> => {
  const name = input.name?.trim() ?? '';
  if (!name) throw new Error('name is required');

  await assertOptionalHealthRecordFks(pool, { focus_area_id: input.focus_area_id });

  return createSymptomLog(pool, {
    recorded_at: input.recorded_at?.trim() || undefined,
    name,
    severity: parseSeverity(input.severity),
    triggers: optionalText(input.triggers),
    duration_minutes: parseDurationMinutes(input.duration_minutes),
    notes: optionalText(input.notes),
    focus_area_id: optionalId(input.focus_area_id),
  });
};
