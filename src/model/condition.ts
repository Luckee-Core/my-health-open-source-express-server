export type Condition = {
  id: string;
  name: string;
  status: 'active' | 'resolved';
  noted_on: string | null;
  diagnosed_on: string | null;
  focus_area_id: string | null;
  notes: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateConditionInput = {
  name: string;
  status?: 'active' | 'resolved';
  noted_on?: string | null;
  diagnosed_on?: string | null;
  focus_area_id?: string | null;
  notes?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateConditionInput = Partial<CreateConditionInput>;
