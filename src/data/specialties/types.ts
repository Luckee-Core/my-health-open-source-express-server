export type Specialty = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CreateSpecialtyInput = {
  name: string;
};

export type UpdateSpecialtyInput = Partial<CreateSpecialtyInput>;
