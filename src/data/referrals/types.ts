export type Referral = {
  id: string;
  referred_on: string | null;
  specialty: string | null;
  reason: string | null;
  status: string | null;
  referred_by_doctor_id: string | null;
  notes: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateReferralInput = {
  referred_on?: string | null;
  specialty?: string | null;
  reason?: string | null;
  status?: string | null;
  referred_by_doctor_id?: string | null;
  notes?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateReferralInput = Partial<CreateReferralInput>;
