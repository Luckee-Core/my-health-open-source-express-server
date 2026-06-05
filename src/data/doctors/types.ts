export type Doctor = {
  id: string;
  name: string;
  hospital_id: string;
  specialty_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDoctorInput = {
  name: string;
  hospital_id: string;
  specialty_id: string;
  notes?: string | null;
};

export type UpdateDoctorInput = Partial<CreateDoctorInput>;
