export type FeedFormula = {
  id: string;
  brand: string;
  name: string;
  calories_per_1000_ml: number;
  container_volume_ml: number;
  volume_fl_oz: number | null;
  volume_qt: number | null;
  volume_l: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateFeedFormulaInput = {
  brand: string;
  name: string;
  calories_per_1000_ml: number;
  container_volume_ml?: number;
  volume_fl_oz?: number | null;
  volume_qt?: number | null;
  volume_l?: number | null;
  is_active?: boolean;
  notes?: string | null;
};

export type UpdateFeedFormulaInput = Partial<CreateFeedFormulaInput>;
