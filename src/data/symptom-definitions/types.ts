export type SymptomDefinition = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateSymptomDefinitionInput = {
  name: string;
  sort_order?: number;
  is_active?: boolean;
};

export type UpdateSymptomDefinitionInput = Partial<CreateSymptomDefinitionInput>;
