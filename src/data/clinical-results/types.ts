export type ClinicalResult = {
  id: string;
  observed_at: string | null;
  name: string;
  value_text: string | null;
  unit: string | null;
  interpretation: string | null;
  category: 'lab' | 'imaging' | 'other';
  appointment_id: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateClinicalResultInput = {
  observed_at?: string | null;
  name: string;
  value_text?: string | null;
  unit?: string | null;
  interpretation?: string | null;
  category?: 'lab' | 'imaging' | 'other';
  appointment_id?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateClinicalResultInput = Partial<CreateClinicalResultInput>;
