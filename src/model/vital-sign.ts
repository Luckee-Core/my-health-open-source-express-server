export type VitalSign = {
  id: string;
  recorded_at: string;
  metric: string;
  value_text: string;
  numeric_value: number | null;
  unit: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateVitalSignInput = {
  recorded_at: string;
  metric: string;
  value_text: string;
  numeric_value?: number | null;
  unit?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateVitalSignInput = Partial<CreateVitalSignInput>;
