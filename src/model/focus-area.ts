export type FocusArea = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateFocusAreaInput = {
  name: string;
  description?: string | null;
};

export type UpdateFocusAreaInput = Partial<CreateFocusAreaInput>;
