export type SymptomLog = {
  id: string;
  recorded_at: string;
  name: string;
  severity: number | null;
  triggers: string | null;
  duration_minutes: number | null;
  notes: string | null;
  focus_area_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateSymptomLogInput = {
  recorded_at?: string;
  name: string;
  severity?: number | null;
  triggers?: string | null;
  duration_minutes?: number | null;
  notes?: string | null;
  focus_area_id?: string | null;
};

export type UpdateSymptomLogInput = Partial<CreateSymptomLogInput>;
