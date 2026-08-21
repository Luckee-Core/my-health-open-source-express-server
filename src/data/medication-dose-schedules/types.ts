export type MedicationDoseSchedule = {
  medication_id: string;
  interval_minutes: number;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type UpsertMedicationDoseScheduleInput = {
  interval_minutes: number;
  reminder_enabled?: boolean;
};
