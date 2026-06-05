export type DailyEntry = {
  id: string;
  entry_date: string;
  focus_area_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDailyEntryInput = {
  entry_date: string;
  focus_area_id: string;
  notes?: string | null;
};

export type UpdateDailyEntryInput = Partial<CreateDailyEntryInput>;
