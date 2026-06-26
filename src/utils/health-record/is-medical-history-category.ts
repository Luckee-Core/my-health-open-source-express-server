import type { MedicalHistoryCategory } from '../../data/medical-history-events/types';

const MEDICAL_HISTORY_CATEGORIES: MedicalHistoryCategory[] = [
  'diagnosis',
  'surgery',
  'radiation',
  'imaging',
  'milestone',
  'other',
];

/**
 * Returns true when value is a valid medical history category.
 */
export const isMedicalHistoryCategory = (value: string): value is MedicalHistoryCategory =>
  MEDICAL_HISTORY_CATEGORIES.includes(value as MedicalHistoryCategory);
