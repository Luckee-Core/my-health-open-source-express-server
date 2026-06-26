import type { Pool } from 'pg';
import { updateMedicalHistoryEventById } from '../../data/medical-history-events/update-medical-history-event-by-id';
import type {
  MedicalHistoryEvent,
  UpdateMedicalHistoryEventInput,
} from '../../data/medical-history-events/types';
import { parseEntryDate } from '../../utils/daily-entries';
import {
  assertOptionalHealthRecordFks,
  isMedicalHistoryCategory,
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
 * Updates a medical history event by id after validating input.
 */
export const processUpdateMedicalHistoryEventById = async (
  pool: Pool,
  id: string,
  input: UpdateMedicalHistoryEventInput,
): Promise<MedicalHistoryEvent> => {
  const normalized: UpdateMedicalHistoryEventInput = { ...input };

  if (input.event_date !== undefined) {
    normalized.event_date = parseEntryDate(input.event_date);
  }
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error('title cannot be empty');
    normalized.title = title;
  }
  if (input.category !== undefined && !isMedicalHistoryCategory(input.category)) {
    throw new Error('category is invalid');
  }
  if (input.description !== undefined) {
    normalized.description = optionalText(input.description);
  }
  if (input.doctor_id !== undefined) {
    normalized.doctor_id = optionalId(input.doctor_id);
  }
  if (input.appointment_id !== undefined) {
    normalized.appointment_id = optionalId(input.appointment_id);
  }
  if (input.focus_area_id !== undefined) {
    normalized.focus_area_id = optionalId(input.focus_area_id);
  }

  await assertOptionalHealthRecordFks(pool, normalized);

  return updateMedicalHistoryEventById(pool, id, normalized);
};
