import type { Pool } from 'pg';
import { updateSymptomLogById } from '../../data/symptom-logs/update-symptom-log-by-id';
import type { SymptomLog, UpdateSymptomLogInput } from '../../data/symptom-logs/types';
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
 * Updates a symptom log by id after validating input.
 */
export const processUpdateSymptomLogById = async (
  pool: Pool,
  id: string,
  input: UpdateSymptomLogInput,
): Promise<SymptomLog> => {
  const normalized: UpdateSymptomLogInput = { ...input };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    normalized.name = name;
  }
  if (input.recorded_at !== undefined) {
    const recordedAt = input.recorded_at.trim();
    if (!recordedAt) throw new Error('recorded_at cannot be empty');
    normalized.recorded_at = recordedAt;
  }
  if (input.severity !== undefined) {
    normalized.severity = parseSeverity(input.severity);
  }
  if (input.duration_minutes !== undefined) {
    normalized.duration_minutes = parseDurationMinutes(input.duration_minutes);
  }
  if (input.triggers !== undefined) {
    normalized.triggers = optionalText(input.triggers);
  }
  if (input.notes !== undefined) {
    normalized.notes = optionalText(input.notes);
  }
  if (input.focus_area_id !== undefined) {
    normalized.focus_area_id = optionalId(input.focus_area_id);
  }

  await assertOptionalHealthRecordFks(pool, { focus_area_id: normalized.focus_area_id });

  return updateSymptomLogById(pool, id, normalized);
};
