export type Doctor = {
  id: string;
  name: string;
  hospital_id: string;
  specialty_id: string;
  notes: string | null;
  npi: string | null;
  phone: string | null;
  fax: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDoctorInput = {
  name: string;
  hospital_id: string;
  specialty_id: string;
  notes?: string | null;
  npi?: string | null;
  phone?: string | null;
  fax?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateDoctorInput = Partial<CreateDoctorInput>;
