export type Medication = {
  id: string;
  name: string;
  instructions: string | null;
  started_on: string | null;
  status: 'active' | 'stopped';
  doctor_id: string | null;
  notes: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateMedicationInput = {
  name: string;
  instructions?: string | null;
  started_on?: string | null;
  status?: 'active' | 'stopped';
  doctor_id?: string | null;
  notes?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateMedicationInput = Partial<CreateMedicationInput>;
