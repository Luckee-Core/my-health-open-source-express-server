export type Allergy = {
  id: string;
  substance: string;
  reaction: string | null;
  criticality: string | null;
  status: 'active' | 'inactive';
  notes: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAllergyInput = {
  substance: string;
  reaction?: string | null;
  criticality?: string | null;
  status?: 'active' | 'inactive';
  notes?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateAllergyInput = Partial<CreateAllergyInput>;
