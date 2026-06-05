export type Hospital = {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateHospitalInput = {
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export type UpdateHospitalInput = Partial<CreateHospitalInput>;
