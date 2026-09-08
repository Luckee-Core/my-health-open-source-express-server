export type InsuranceCoverage = {
  id: string;
  payer_name: string;
  member_id: string | null;
  group_number: string | null;
  plan_name: string | null;
  status: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInsuranceCoverageInput = {
  payer_name: string;
  member_id?: string | null;
  group_number?: string | null;
  plan_name?: string | null;
  status?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateInsuranceCoverageInput = Partial<CreateInsuranceCoverageInput>;
