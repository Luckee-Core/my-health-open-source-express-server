export type MedicationDoseLog = {
  id: string;
  medication_id: string;
  taken_at: string;
  notes: string | null;
  created_at: string;
};

export type CreateMedicationDoseLogInput = {
  taken_at?: string;
  notes?: string | null;
};
