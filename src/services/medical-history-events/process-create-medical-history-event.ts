import type { Pool } from 'pg';
import { createMedicalHistoryEvent } from '../../data/medical-history-events/create-medical-history-event';
import type {
  CreateMedicalHistoryEventInput,
  MedicalHistoryEvent,
} from '../../model/medical-history-event';
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
 * Creates a medical history event after validating input and foreign keys.
 */
export const processCreateMedicalHistoryEvent = async (
  pool: Pool,
  input: CreateMedicalHistoryEventInput,
): Promise<MedicalHistoryEvent> => {
  if (!input.event_date?.trim()) throw new Error('event_date is required');

  const title = input.title?.trim() ?? '';
  if (!title) throw new Error('title is required');

  const category = input.category ?? 'other';
  if (!isMedicalHistoryCategory(category)) {
    throw new Error('category is invalid');
  }

  const eventDate = parseEntryDate(input.event_date);
  await assertOptionalHealthRecordFks(pool, input);

  return createMedicalHistoryEvent(pool, {
    event_date: eventDate,
    title,
    category,
    description: optionalText(input.description),
    doctor_id: optionalId(input.doctor_id),
    appointment_id: optionalId(input.appointment_id),
    focus_area_id: optionalId(input.focus_area_id),
  });
};
