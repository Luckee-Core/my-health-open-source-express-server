export type Specialty = {
  id: string;
  name: string;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateSpecialtyInput = {
  name: string;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateSpecialtyInput = Partial<CreateSpecialtyInput>;
