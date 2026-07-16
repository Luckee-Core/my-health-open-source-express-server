export type Hospital = {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateHospitalInput = {
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateHospitalInput = Partial<CreateHospitalInput>;
